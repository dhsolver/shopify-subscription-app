import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { find, get, some } from 'lodash';
import store from 'store';
import Axios from 'axios';

import { Icon } from 'antd';

import Button from './common/Button';
import Center from './common/Center';
import Spacer from './common/Spacer';

import OrderGroup from './OrderGroup';
import ProcessedOrderGroup from './ProcessedOrderGroup';
import Router from 'next/router';
import PlateIcon from './icons/PlateIcon';
import SmartBool from '@mighty-justice/smart-bool';
import { FAMILY_TIME_PRICE, FAMILY_TIME_PRODUCT_ID, FAMILY_TIME_VARIANT_ID } from '../constants';
import Loader from './common/Loader';

@autoBindMethods
@observer
class Orders extends Component<{}> {
  @observable private hasAddedFamilyTime = new SmartBool();
  @observable private isProcessingFamilyTime = new SmartBool();
  @observable private queuedCharge = [];
  @observable private processedCharge = [];
  @observable private firstCharge = new SmartBool();
  @observable private recipes = [];
  @observable private oneTime = null;
  @observable private customerAddressID;

  private rechargeId: string | number = null;
  private subscriptionId: string | number = null;
  private subscriptionInfo: {};

  public async componentDidMount () {
    this.rechargeId = get(store.get('customerInfo'), 'rechargeId');
    if (!this.rechargeId) {
      Router.push('/onboarding-name');
      return;
    }
    await this.fetchProcessedChargeData();
    await this.fetchData();
    await this.fetchSubscriptionInfo();
    this.recipes = await this.fetchRecipes();
  }

  public async fetchData () {
    this.queuedCharge = await this.fetchQueuedCharge();
  }

  public async fetchProcessedChargeData () {
    const processedCharges = await this.fetchProcessedCharges();
    this.processedCharge = processedCharges[processedCharges.length - 1];

    if (processedCharges.length === 1) {
      this.firstCharge.setTrue();
    } else {
      this.firstCharge.setFalse();
    }
  }

  public async fetchQueuedCharge () {
    const { data } = await Axios.get(`/recharge-queued-charges/?customer_id=${this.rechargeId}`);
    this.subscriptionId = data.charges[0].line_items[0].subscription_id;

    return data.charges;
  }

  public async fetchSubscriptionInfo () {
    const { data } = await Axios.get(`/subscriptions/${this.subscriptionId}`);
    this.subscriptionInfo = data.subscription;
    return;
  }

  public async fetchProcessedCharges () {
    const { data } = await Axios.get(`/recharge-processed-charges/?customer_id=${this.rechargeId}`);

    return data.charges;
  }

  public async fetchRecipes () {
    const [rechargeResponse, shopifyResponse] = await Promise.all([
        Axios.get('/recharge-products/'),
        Axios.get('/shopify-menu-products/'),
      ])
      , rechargeProductData = rechargeResponse.data.products
      , shopifyProductData = shopifyResponse.data.products
      , recipes = rechargeProductData.map(product => ({
        ...product,
        ...shopifyProductData.find(shopifyProduct => shopifyProduct.id === product.shopify_product_id),
      }))
      ;

    return recipes;
  }

  private async addFamilyTime (charge) {
    const { address_id, scheduled_at } = charge
      , submitData = {
        next_charge_scheduled_at: scheduled_at,
        price: FAMILY_TIME_PRICE,
        product_title: 'Family Time',
        quantity: 1,
        shopify_product_id: FAMILY_TIME_PRODUCT_ID,
        shopify_variant_id: FAMILY_TIME_VARIANT_ID,
      }
      ;

    this.isProcessingFamilyTime.setTrue();
    const {data: { onetime }} = await Axios.post(`/onetimes/address/${address_id}`, submitData);
    this.oneTime = onetime;
    await this.fetchQueuedCharge();

    this.hasAddedFamilyTime.setTrue();
    this.isProcessingFamilyTime.setFalse();
  }

  private async onRemoveFamilyTime () {
    this.isProcessingFamilyTime.setTrue();
    await Axios.delete(`/onetimes/${this.oneTime.id || this.oneTime.subscription_id}`);
    await this.fetchQueuedCharge();
    this.hasAddedFamilyTime.setFalse();
    this.isProcessingFamilyTime.setFalse();
  }

  private renderFamilyTime = (charge: any) => {
    const className = cx(
      'family-time',
      {added: this.hasAddedFamilyTime.isTrue},
      {loading: this.isProcessingFamilyTime.isTrue},
    );

    if (this.hasAddedFamilyTime.isTrue) {
      const RemoveButton = this.isProcessingFamilyTime.isTrue
        ? <>Removing... <Icon type='loading' /></>
        : <a onClick={this.onRemoveFamilyTime}>Remove</a>
      ;

      return (
        <div className={className} key={`icon-${charge}`}>
          <div className='content'>
            <PlateIcon />
            <div className='title'>Yay! You've added Family Time to your next order!</div>
            <p>Adult sized versions of Tiny on the way!</p>
            <div className='remove'>
              Not that hungry ? {RemoveButton}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={className} key={`icon-${charge}`}>
        <div className='content'>
          <div className='title'>Spend mealtime with your Little One!</div>
          <p>
            Add Family Time to your next order and{` `}
            get three adult sized Tiny meals in your next shipment for $14.99!
          </p>
          {
            this.isProcessingFamilyTime.isTrue
              ? (
                <Button type='primary' size='large'>
                  <Icon type='loading' />
                  Adding<strong>Family Time</strong>...
                </Button>
              )
              : (
                <Button type='primary' size='large' onClick={this.addFamilyTime.bind(this, charge)}>
                  <Icon type='plus-circle' theme='filled' />
                  Add<strong>Family Time</strong>
                </Button>
              )
          }
        </div>
      </div>
    );
  }

  public render () {
    if (!this.queuedCharge.length || !this.recipes.length) { return <Loader />; }

    return (
      <div className='page-orders'>
      {this.processedCharge ? (
          <div>
            <Spacer />
            <Spacer />
            <Center>
              <h2>Current Order</h2>
            </Center>
            <Spacer />
            <ProcessedOrderGroup
              fetchData={this.fetchProcessedChargeData}
              charge={this.processedCharge}
              recipes={this.recipes}
              firstCharge={this.firstCharge}
            />
           <Spacer />
          </div>
          ) : (
            <Spacer />
          )
        }
        <Spacer />

        <Center>
          <h2>Next Order</h2>
        </Center>

        <Spacer />

        {this.queuedCharge.map(
          charge => [
            this.renderFamilyTime(charge),
            <Spacer key={`spacer-${charge.id}`} large />,
            (<OrderGroup
              fetchData={this.fetchData}
              subscriptionData={this.subscriptionInfo}
              key={charge.id}
              charge={charge}
              hasAddedFamilyTime={this.hasAddedFamilyTime.isTrue}
              recipes={this.recipes}
            />),
          ],
        )}
      </div>
    );
  }
}

export default Orders;
