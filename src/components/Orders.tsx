import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { find, get, some } from 'lodash';
import store from 'store';
import Axios from 'axios';

import {
  Col,
  Icon,
  Row,
} from 'antd';

import Center from './common/Center';
import Spacer from './common/Spacer';

import OrderGroup from './OrderGroup';
import Router from 'next/router';
import { IconButton } from './common/Button';
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
    this.oneTime = find(this.charges[0].line_items, {shopify_product_id: FAMILY_TIME_PRODUCT_ID});

    if (some(this.charges[0].line_items, {shopify_product_id: FAMILY_TIME_PRODUCT_ID})) {
      this.hasAddedFamilyTime.setTrue();
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
      return <IconButton icon={PlateIcon} onClick={this.onRemoveFamilyTime} />;
    }

    return (
      <IconButton onClick={this.addFamilyTime.bind(this, charge)} type='primary' icon={this.addFamilyTimeIcon}>
        Add<b> Family Time</b>
      </IconButton>
    );
  }

  public render () {
    return (
      <>
        <Spacer />

        <Center>
          <h2>Upcoming Orders</h2>
        </Center>

        <Spacer large />

        {this.charges.map(
          charge => (
            <>
              <div style={{width: '50%'}}>
                <Row align='middle' justify='start' type='flex' gutter={4}>
                  <Col span={2}>
                    {this.renderFamilyTimeIcon(charge)}
                  </Col>
                  <Col span={6} style={{backgroundColor: '#1394C9', color: 'white', height: '100%'}}>
                    {this.hasAddedFamilyTime.isTrue
                      ? <span style={{color: 'white'}}>Yay!</span>
                      : <span style={{color: 'white'}}>Family Time</span>
                    }
                  </Col>
                  <Col span={16} style={{backgroundColor: '#1394C9', color: 'white'}}>
                    {this.hasAddedFamilyTime.isTrue
                      ? <span>Adult sized versions of Tiny coming your way!</span>
                      : <span> Add a set of three adult sized Tiny meals to this order for $14.99</span>
                    }
                  </Col>
                </Row>
              </div>
              <Spacer />
              <OrderGroup
                fetchCharges={this.fetchCharges}
                key={charge.id}
                charge={charge}
                hasAddedFamilyTime={this.hasAddedFamilyTime.isTrue}
              />
            </>
          ),
        )}
      </>
    );
  }
}

export default Orders;
