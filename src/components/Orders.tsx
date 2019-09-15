import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { find, get, some } from 'lodash';
import store from 'store';
import Axios from 'axios';

import { Icon } from 'antd';

import Button from './common/Button';
import Center from './common/Center';
import Spacer from './common/Spacer';

import OrderGroup from './OrderGroup';
import Router from 'next/router';
import PlateIcon from './icons/PlateIcon';
import SmartBool from '@mighty-justice/smart-bool';
import { FAMILY_TIME_PRICE, FAMILY_TIME_PRODUCT_ID, FAMILY_TIME_VARIANT_ID } from '../constants';

@autoBindMethods
@observer
class Orders extends Component<{}> {
  @observable private hasAddedFamilyTime = new SmartBool();
  @observable private charges = [];
  @observable private oneTime = null;
  @observable private customerAddressID;

  private rechargeId: string | number = null;

  public async componentDidMount () {
    this.rechargeId = get(store.get('customerInfo'), 'rechargeId');
    await this.fetchCharges();
    if (this.charges[0]) {
      this.oneTime = find(this.charges[0].line_items, {shopify_product_id: FAMILY_TIME_PRODUCT_ID});
      const includesFamilyTime = some(this.charges[0].line_items, {shopify_product_id: FAMILY_TIME_PRODUCT_ID});
      if (includesFamilyTime) { this.hasAddedFamilyTime.setTrue(); }
      else if (store.get('familyTime')) { await this.addFamilyTime(this.charges[0]); }
    }
  }

  public async fetchCharges () {
    if (!this.rechargeId) {
      Router.push('/index');
      return;
    }

    const { data } = await Axios.get(`/recharge-queued-charges/?customer_id=${this.rechargeId}`);

    this.charges = data.charges;
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

    const {data: { onetime }} = await Axios.post(`/onetimes/address/${address_id}`, submitData);
    this.oneTime = onetime;
    await this.fetchCharges();

    this.hasAddedFamilyTime.setTrue();
  }

  private get addFamilyTimeIcon () { return () => <Icon type='plus-circle' theme='filled' />; }

  private async onRemoveFamilyTime () {
    await Axios.delete(`/onetimes/${this.oneTime.id || this.oneTime.subscription_id}`);
    await this.fetchCharges();
    this.hasAddedFamilyTime.setFalse();
  }

  private renderFamilyTimeIcon = (charge: any) => {
    if (this.hasAddedFamilyTime.isTrue) {
      return (
        <div className='btn-family-time'>
          <PlateIcon onClick={this.onRemoveFamilyTime} />
          <div className='box-info'>
            Yay! <small>Adult-sized versions of tiny coming your way!</small>
          </div>
        </div>
      );
    }

    return (
      <div className='btn-family-time' onClick={this.addFamilyTime.bind(this, charge)}>
        <Button className='btn-add' type='primary' icon='plus' shape='circle' />
        <div className='box-info'>
          <span>Family Time</span>
          <small className='smaller'>
            Add a set of three adult sized Tiny
            <br />
            meals to this order for 14.99$
          </small>
        </div>
      </div>
    );
  }

  public render () {
    return (
      <div className='page-orders'>
        <Spacer />

        <Center>
          <h2>Upcoming Orders</h2>
        </Center>

        <Spacer />

        {this.charges.map(
          charge => (
            <>
              {this.renderFamilyTimeIcon(charge)}
              <OrderGroup
                fetchCharges={this.fetchCharges}
                key={charge.id}
                charge={charge}
                hasAddedFamilyTime={this.hasAddedFamilyTime.isTrue}
              />
            </>
          ),
        )}
      </div>
    );
  }
}

export default Orders;
