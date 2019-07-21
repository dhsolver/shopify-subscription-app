import React, { Component } from 'react';
import { Form } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Col, Row } from 'antd';
import Button from './common/Button';
import Router from 'next/router';

const colProps = { span: 12 };
const GUTTER = 48;

export const personalInfoFieldSet = {
  fields: [
    { field: 'first_name' },
    { field: 'last_name' },
  ],
  legend: 'Personal Info',
};

export const paymentInfoFieldSet = {
  colProps,
  fields: [
    { field: 'payment_info.credit_card_number' },
    { field: 'payment_info.expiration_date' },
    { field: 'payment_info.cvv,', label: 'CVV' },
  ],
  legend: 'Payment Info',
};

export const insertBillingIf = (model: any) => model.billing_address && !model.billing_address.is_same_as_shipping;

export const billingAddressFieldSet = {
  colProps,
  fields: [
    {
      editProps: {defaultChecked: true},
      field: 'billing_address.is_same_as_shipping',
      type: 'checkbox',
      value: true,
    },
    { field: 'billing_address', type: 'address', insertIf: insertBillingIf },
  ],
  legend: 'Billing Address',
};

export const discountCodeFieldSet = {
  colProps,
  fields: [
    { field: 'discount_code' },
  ],
  legend: 'Apply Discount',
};

export const shippingAddressFieldSet = {
  colProps,
  fields: [
    {field: 'first_name'},
    {field: 'last_name'},
    {field: 'shipping_address', type: 'address'},
  ],
  legend: 'Shipping Address',
};

export const accountDetailsFieldSet = {
  colProps,
  fields: [
    {field: 'email'},
    {field: 'password'},
    {field: 're_password'},
    { field: 'newsletter_signup', type: 'checkbox' },
  ],
  legend: 'Account Details',
};

const fieldSetsLeft = [
  paymentInfoFieldSet,
  billingAddressFieldSet,
  discountCodeFieldSet,
];

const fieldSetsRight = [
  shippingAddressFieldSet,
  accountDetailsFieldSet,
];

@inject('getOptions')
@autoBindMethods
@observer
class AccountInfoForm extends Component <{}> {
  private get fieldSets () {
    return {fieldSetsLeft, fieldSetsRight};
  }

  private onSave (model: any) {
    model.preventDefault();
    Router.push('/order-confirmation');
  }

  public render () {
    return (
      <Row>
        <Row type='flex' justify='center'>
          <h2>Finalize Your Subscription!</h2>
        </Row>
        <Row>
          <br/>
        </Row>
        <Row type='flex' gutter={GUTTER} justify='space-between'>
          <Col span={12}>
            <Form
              fieldSets={this.fieldSets.fieldSetsLeft}
              showControls={false}
            />
          </Col>
          <Col span={12}>
            <Form
              fieldSets={this.fieldSets.fieldSetsRight}
              showControls={false}
            />
          </Col>
        </Row>
        <Row type='flex' justify='center'>
          <Button onClick={this.onSave}>Submit</Button>
        </Row>
    </Row>
    );
  }
}

export default AccountInfoForm;
