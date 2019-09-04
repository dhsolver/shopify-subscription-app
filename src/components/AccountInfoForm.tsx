import React, { Component } from 'react';
import { Form } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Col, Row } from 'antd';
import Router from 'next/router';
import Axios from 'axios';
import store from 'store';
import { get, noop } from 'lodash';

import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(
  () => import('./StripeForm'),
  { ssr: false },
);

const colProps = { span: 12 };
const GUTTER = 48;

export const personalInfoFieldSet = {
  fields: [
    { field: 'first_name', required: true },
    { field: 'last_name', required: true },
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

export const insertBillingIf = (model: any) => model.billing && !model.billing.is_same_as_shipping;

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
    {field: 'first_name', required: true },
    {field: 'last_name', required: true },
    {field: 'shipping', type: 'address', required: true },
  ],
  legend: 'Shipping Address',
};

export const accountDetailsFieldSet = {
  colProps,
  fields: [
    {field: 'email', required: true},
    {field: 'phone', required: true},
    {field: 'password', required: true},
    {field: 'password_confirmation', writeOnly: true, label: 'Confirm Password', required: true },
  ],
  legend: 'Account Details',
};

const fieldSetsLeft = [
  // paymentInfoFieldSet,
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
  private stripeToken;
  public componentDidMount () {
    if (!store.get('product_id') || !store.get('variant_id')) {
      Router.push('/frequency-selection');
    }
  }

  private stripeFormRef;
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

  private serializeRechargeCheckoutInfo (model: any) {
    const { frequency } = store.get('subscriptionInfo');

    return {
      checkout: {
        discount_code: model.discount_code,
        email: model.email,
        line_items: [
          {
            charge_interval_frequency: frequency,
            order_interval_frequency: frequency,
            order_interval_unit: 'week',
            product_id: store.get('product_id'),
            quantity: 1,
            variant_id: store.get('variant_id'),
          },
        ],
        shipping_address: {...this.serializeShopifyCustomerInfo(model).addresses[0], province: model.shipping.state},
      },
    };
  }

  private getStripeFormRef (form: any) {
    this.stripeFormRef = form;
  }

  private async onSave (model: any) {
    await this.stripeFormRef.props.onSubmit({preventDefault: noop});
    const {data: {id}} = await Axios.post('/shopify-customers/', this.serializeShopifyCustomerInfo(model))
      , rechargeSubmitData = {...this.serializeRechargeCustomerInfo(model), shopify_customer_id: id}
      , rechargeCustomerResponse = await Axios.post('/recharge-customers/', rechargeSubmitData)
      , rechargeCheckoutResponse = await Axios.post('/recharge-checkouts/', this.serializeRechargeCheckoutInfo(model))
      , { checkout: { token } } = rechargeCheckoutResponse.data
      , shippingRates = await Axios.get(`/recharge-checkouts/${token}/shipping-rates`)
      ;

    store.set('customerInfo', {id, rechargeId: rechargeCustomerResponse.data.id});

    await Axios.put(`/recharge-checkouts/${token}/`, {
      checkout: {
        shipping_line: {handle: get(shippingRates, 'data.shipping_rates[0].handle') || 'shopify-Free%20Shipping-0.00' },
      },
    });

    await Axios.post(`/recharge-charges/${token}/`, {
      checkout_charge: { payment_processor: 'stripe', payment_token: this.stripeToken },
    });

    Router.push('/order-confirmation');
    return rechargeCustomerResponse;
  }

  public handleResult ({token}: any) {
    this.stripeToken = token.id;
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
            <DynamicComponentWithNoSSR
              getStripeFormRef={this.getStripeFormRef}
              stripePublicKey='pk_test_gxEKMtkVdWvm3LArf1ipX5TX'
              handleResult={this.handleResult}
            />
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
