import React, { Component } from 'react';
import store from 'store';
import { get } from 'lodash';

import { Avatar, Col, Row } from 'antd';

import { fillInFieldSet } from '@mighty-justice/fields-ant';

import {
  accountDetailsFieldSet,
  personalInfoFieldSet,
  shippingAddressFieldSet,
} from './AccountInfoForm';

import Center from './common/Center';
import Spacer from './common/Spacer';

const billingAddressFieldSet = {
  fields: [{field: 'billing', type: 'address'}],
  legend: 'Billing Address',
};

import PersonalInfoForm from './PersonalInfoForm';
import SubscriptionSelector from './SubscriptionSelector';
import Axios from 'axios';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';

const GUTTER = 48
  , AVATAR_SIZE = 200
  , ITEM_COLS = {xs: 24, md: 12}
  , HEADER_COLS = {xs: 24, sm: 8};

@autoBindMethods
@observer
class Account extends Component<{}> {
  @observable private customer = {};
  @observable private isLoading = new SmartBool(true);

  public async componentDidMount () {
    const rechargeId = get(store.get('customerInfo'), 'rechargeId')
      , response = await Axios.get(`/recharge-customers/${rechargeId}`)
      ;

    this.customer = response.data.customer;
    this.isLoading.setFalse();
  }

  public render () {
    if (this.isLoading.isTrue) { return 'loading......'; }

    return (
      <Row>
        <Spacer />
        <Center>
          <h2>Sebi's Account</h2>
          <Spacer />
          <Row gutter={GUTTER} type='flex' justify='center'>
            <Col {...HEADER_COLS}>
              <Avatar size={AVATAR_SIZE} src='http://placekitten.com/200/200' />
            </Col>
          </Row>

        </Center>
        <Spacer large />
        <Row gutter={GUTTER}>
          <Col {...ITEM_COLS}>
            <Row>
              <PersonalInfoForm model={this.customer} fieldSet={fillInFieldSet(personalInfoFieldSet)} />
            </Row>
            <Row>
              <PersonalInfoForm model={this.customer} fieldSet={fillInFieldSet(shippingAddressFieldSet)} />
            </Row>
            <Row>
              <PersonalInfoForm model={this.customer} fieldSet={fillInFieldSet(billingAddressFieldSet)} />
            </Row>
          </Col>
          <Col {...ITEM_COLS}>
            <Center>
              <h3>Subscription Details</h3>
            </Center>
            <Center>
              <p>$4.99 per meal</p>
              <SubscriptionSelector />
            </Center>
            <Row>
              <PersonalInfoForm model={this.customer} fieldSet={fillInFieldSet(accountDetailsFieldSet)} />
            </Row>
          </Col>
        </Row>
      </Row>
    );
  }
}

export default Account;
