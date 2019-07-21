import React, { Component } from 'react';
import { Col, Row } from 'antd';
import { fillInFieldSet, Form } from '@mighty-justice/fields-ant';
import Button, {
  accountDetailsFieldSet,
  billingAddressFieldSet,
  paymentInfoFieldSet,
  personalInfoFieldSet,
  shippingAddressFieldSet,
} from './AccountInfoForm';

import PersonalInfoForm from './PersonalInfoForm';
import SubscriptionSelector from './SubscriptionSelector';

const GUTTER = 48;

class Account extends Component<{}> {
  public render () {
    return (
      <Row>
        <Row type='flex' justify='center'>
          <h2>Finalize Your Subscription!</h2>
        </Row>
        <Row>
          <br/>
        </Row>
        <Row type='flex' justify='space-between' gutter={GUTTER}>
          <Col span={12}>
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
              {/*<PersonalInfoForm fieldSet={fillInFieldSet(billingAddressFieldSet)} />*/}
            </Row>
          </Col>
          <Col span={12}>
            <Row type='flex' justify='center'>
              <h3>Subscription Details</h3>
            </Row>
            <Row type='flex' justify='center'>
              <p>$4.99 per meal</p>
              <SubscriptionSelector />
            </Row>
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
