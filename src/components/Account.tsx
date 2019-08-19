import React, { Component } from 'react';
import { Avatar, Col, Row } from 'antd';
import { fillInFieldSet } from '@mighty-justice/fields-ant';
import {
  accountDetailsFieldSet,
  paymentInfoFieldSet,
  personalInfoFieldSet,
  shippingAddressFieldSet,
} from './AccountInfoForm';

import Center from './common/Center';
import Spacer from './common/Spacer';

const billingAddressFieldSet = {
  fields: [{field: 'billing_address', type: 'address'}],
  legend: 'Billing Address',
};

import PersonalInfoForm from './PersonalInfoForm';
import SubscriptionSelector from './SubscriptionSelector';

const GUTTER = 48
  , AVATAR_SIZE = 200
  , ITEM_COLS = {xs: 24, md: 12}
  , HEADER_COLS = {xs: 24, sm: 8};

class Account extends Component<{}> {
  public render () {
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
            <Col {...HEADER_COLS}>
              <p>Sebastian is 48 weeks old</p>
              <h3>His favorite meal is Coconut Curry</h3>
            </Col>
          </Row>

        </Center>
        <Spacer large />
        <Row gutter={GUTTER}>
          <Col {...ITEM_COLS}>
            <Row>
              <PersonalInfoForm fieldSet={fillInFieldSet(personalInfoFieldSet)} />
            </Row>
            <Row>
              <PersonalInfoForm fieldSet={fillInFieldSet(paymentInfoFieldSet)} />
            </Row>
            <Row>
              <PersonalInfoForm fieldSet={fillInFieldSet(shippingAddressFieldSet)} />
            </Row>
            <Row>
              <PersonalInfoForm fieldSet={fillInFieldSet(billingAddressFieldSet)} />
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
              <PersonalInfoForm fieldSet={fillInFieldSet(accountDetailsFieldSet)} />
            </Row>
          </Col>
        </Row>
      </Row>
    );
  }
}

export default Account;
