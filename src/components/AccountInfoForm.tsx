import React, { Component } from 'react';
import { Form } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Col, Row } from 'antd';
import Router from 'next/router';
import Axios from 'axios';

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
      field: 'billing.is_same_as_shipping',
      type: 'checkbox',
      value: true,
    },
    { field: 'billing', type: 'address', insertIf: insertBillingIf },
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
    {field: 'shipping', type: 'address'},
  ],
  legend: 'Shipping Address',
};

export const accountDetailsFieldSet = {
  colProps,
  fields: [
    {field: 'email'},
    {field: 'phone'},
    {field: 'password'},
    {field: 'password_confirmation', writeOnly: true, label: 'Confirm Password'},
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

  private serializeShopifyCustomerInfo (model: any) {
    const data = {
      addresses: [
        {
          address1: model.shipping.address1,
          address2: model.shipping.address2,
          city: model.shipping.city,
          country: 'United States',
          first_name: model.first_name,
          last_name: model.last_name,
          phone: model.phone,
          province: 'NY',
          zip: model.shipping.zip_code,
        },
      ],
      email: model.email,
      first_name: model.first_name,
      last_name: model.last_name,
      password: model.password,
      password_confirmation: model.password_confirmation,
      phone: model.phone,
    };

    if (!model.billing.is_same_as_shipping) {
      data.addresses.push({
        address1: model.billing.address1,
        address2: model.billing.address2,
        city: model.billing.city,
        country: 'United States',
        first_name: model.first_name,
        last_name: model.last_name,
        phone: model.phone,
        province: model.billing.state,
        zip: model.billing.zip_code,
      });
    }

    return data;
  }

  private serializeRechargeCustomerInfo (model: any) {
    return {
      billing_address1: model.shipping.address1,
      billing_address2: model.shipping.address2,
      billing_city: model.shipping.city,
      billing_country: 'United States',
      billing_first_name: model.first_name,
      billing_last_name: model.last_name,
      billing_phone: model.phone,
      billing_province: model.shipping.state,
      billing_zip: model.shipping.zip_code,
      email: model.email,
      first_name: model.first_name,
      last_name: model.last_name,
      status: 'ACTIVE',
    };
  }

  private async onSave (model: any) {
    const {data: {id}} = await Axios.post('/shopify-customers/', this.serializeShopifyCustomerInfo(model))
      , rechargeSubmitData = {...this.serializeRechargeCustomerInfo(model), shopify_customer_id: id}
      , rechargeCustomerResponse = await Axios.post('/recharge-customers/', rechargeSubmitData)
      ;

    Router.push('/order-confirmation');
    return rechargeCustomerResponse;
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
              fieldSets={[...this.fieldSets.fieldSetsLeft, ...this.fieldSets.fieldSetsRight]}
              onSave={this.onSave}
            />
          </Col>
          {/*<Col span={12}>*/}
            {/*<Form*/}
              {/*fieldSets={this.fieldSets.fieldSetsRight}*/}
              {/*showControls={false}*/}
              {/*onSave={this.onSave}*/}
            {/*/>*/}
          {/*</Col>*/}
        </Row>
        {/*<Row type='flex' justify='center'>*/}
          {/*<Button type='primary' size='large' onClick={this.onSave}>Submit</Button>*/}
        {/*</Row>*/}
      </Row>
    );
  }
}

export default AccountInfoForm;
