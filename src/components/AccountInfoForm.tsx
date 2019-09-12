import React, { Component } from 'react';
import { Form } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Card, Col, Row } from 'antd';
import Router from 'next/router';
import Axios from 'axios';
import store from 'store';
import { get, noop } from 'lodash';
import Decimal from 'decimal.js';

import dynamic from 'next/dynamic';

import Spacer from './common/Spacer';
import { PRICING, states_hash } from '../constants';
import { formatMoney } from '@mighty-justice/utils';
import { observable } from 'mobx';

const DynamicComponentWithNoSSR = dynamic(
  () => import('./StripeForm'),
  { ssr: false },
);

const colProps = { span: 12 };
const GUTTER = 48;

const COL_PAYMENT = {
  md: { span: 11, push: 1 },
  xs: { span: 24 },
};

const COL_SUMMARY = {
  md: { span: 11, pull: 1 },
  xs: { span: 24 },
};

export const personalInfoFieldSet = {
  fields: [
    { field: 'first_name', required: true },
    { field: 'last_name', required: true },
  ],
  legend: 'Personal Info',
};

export const insertBillingIf = (model: any) => model.billing && !model.billing.is_same_as_shipping;

export const billingAddressFieldSet = {
  colProps,
  fields: [
    {
      editProps: {description: 'Is Same as Shipping', defaultChecked: true},
      field: 'billing.is_same_as_shipping',
      label: '',
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

// TODO: seriously, why?
const emptyFieldSet = {fields: [], legend: ''};

export const shippingAddressFieldSet = {
  colProps,
  fields: [
    {field: 'first_name', required: true },
    {field: 'last_name', required: true },
    // TODO why is this not autofilling
    {field: 'shipping', type: 'address', required: true },
  ],
  legend: 'Shipping Address',
};

export const accountDetailsFieldSet = {
  colProps,
  fields: [
    {field: 'email', required: true},
    // TODO: why is this not validating
    {field: 'phone', required: true},
    {field: 'password', required: true},
    {field: 'password_confirmation', writeOnly: true, label: 'Confirm Password', required: true },
  ],
  legend: 'Account Details',
};

const fieldSets = [
  shippingAddressFieldSet,
  accountDetailsFieldSet,
  billingAddressFieldSet,
  emptyFieldSet,
];

@inject('getOptions')
@autoBindMethods
@observer
class AccountInfoForm extends Component <{}> {
  private stripeToken;
  private discountCode;
  @observable private pricing: any = {};

  public componentDidMount () {
    if (!store.get('product_id') || !store.get('variant_id')) {
      Router.push('/frequency-selection');
    }

    const subscriptionInfo = store.get('subscriptionInfo')
      , quantity = get(subscriptionInfo, 'quantity')
      , frequency = get(subscriptionInfo, 'frequency')
      , perItemPrice = PRICING[quantity]
      , itemDecimal = new Decimal(perItemPrice)
      , totalPrice = itemDecimal.times(quantity).toDecimalPlaces(2).toString()
      ;

    this.pricing = {quantity, frequency, perItemPrice, totalPrice};
    this.serializeMetafields();
  }

  private stripeFormRef;

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
          province: states_hash[model.shipping.state],
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
        province: states_hash[model.billing.state],
        zip: model.billing.zip_code,
      });
    }

    return data;
  }

  private serializeRechargeCustomerInfo (model: any) {
    if (!model.billing.is_same_as_shipping) {
      return {
        billing_address1: model.billing.address1,
        billing_address2: model.billing.address2,
        billing_city: model.billing.city,
        billing_country: 'United States',
        billing_first_name: model.first_name,
        billing_last_name: model.last_name,
        billing_phone: model.phone,
        billing_province: model.billing.state,
        billing_zip: model.billing.zip_code,
        email: model.email,
        first_name: model.first_name,
        last_name: model.last_name,
        status: 'ACTIVE',
      };
    }

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
    const { frequency } = store.get('subscriptionInfo')
      , boxItems = store.get('boxItems')
      , lineItems = Object.keys(boxItems).map(id => ({
          charge_interval_frequency: frequency,
          order_interval_frequency: frequency,
          order_interval_unit: 'week',
          product_id: id,
          quantity: boxItems[id].quantity,
          variant_id: boxItems[id].variant_id,
        }));

    return {
      checkout: {
        discount_code: get(this.discountCode, 'code'),
        email: model.email,
        line_items: lineItems.filter(lineItem => lineItem.quantity),
        shipping_address: {...this.serializeShopifyCustomerInfo(model).addresses[0], province: model.shipping.state},
      },
    };
  }

  private serializeMetafields () {
    const nameInfo = store.get('nameInfo')
      , babyInfo = store.get('babyInfo')
      , combinedInfo = JSON.stringify({...nameInfo, ...babyInfo})
      ;

    return {
      description: 'onboarding_info',
      key: 'onboarding',
      namespace: 'personal_info',
      owner_resource: 'customer',
      value: combinedInfo,
      value_type: 'string',
    };
  }

  private getStripeFormRef (form: any) {
    this.stripeFormRef = form;
  }

  private async onAddDiscount (model) {
    const { data } = await Axios.get(`/discounts/${model.discount_code}`);
    if (data.discounts.length) { this.discountCode = data.discounts[0]; }
  }

  private async onSave (model: any) {
    await this.stripeFormRef.props.onSubmit({preventDefault: noop});
    const {data: {id}} = await Axios.post('/shopify-customers/', this.serializeShopifyCustomerInfo(model))
      , rechargeSubmitData = {...this.serializeRechargeCustomerInfo(model), shopify_customer_id: id}
      , rechargeCustomerResponse = await Axios.post('/recharge-customers/', rechargeSubmitData)
      , rechargeId = rechargeCustomerResponse.data.customer.id
      , rechargeCheckoutResponse = await Axios.post('/recharge-checkouts/', this.serializeRechargeCheckoutInfo(model))
      , { checkout: { token } } = rechargeCheckoutResponse.data
      , shippingRates = await Axios.get(`/recharge-checkouts/${token}/shipping-rates`)
      , familyTime = store.get('familyTime')
      , metafieldData = {metafield: {...this.serializeMetafields(), owner_id: rechargeId}}
      ;

    store.set('customerInfo', {id, rechargeId});

    await Axios.post('/recharge-metafields/', metafieldData);
    await Axios.put(`/recharge-checkouts/${token}/`, {
      checkout: {
        shipping_line: {handle: get(shippingRates, 'data.shipping_rates[0].handle') || 'shopify-Free%20Shipping-0.00' },
      },
    });

    await Axios.post(`/recharge-charges/${token}/`, {
      checkout_charge: { payment_processor: 'stripe', payment_token: this.stripeToken },
    });

    if (familyTime) {
      const { data: { charges } } = await Axios.get(`/recharge-queued-charges/?customer_id=${rechargeId}`)
        , familyTimeSubmitData = {...familyTime, next_charge_scheduled_at: charges[0].scheduled_at}
        ;
      await Axios.post(`/onetimes/address/${charges[0].address_id}`, familyTimeSubmitData);
    }

    Router.push('/order-confirmation');
    return rechargeCustomerResponse;
  }

  public handleResult ({token}: any) {
    this.stripeToken = token.id;
  }

  public render () {
    const {quantity, frequency, perItemPrice, totalPrice} = this.pricing;

    return (
      <div>
        <Spacer />
        <Row type='flex' justify='center'>
          <h2>Finalize Your Subscription</h2>
        </Row>
        <Spacer />
        <Row type='flex' justify='center'>
          <h3>Payment &amp; Account Info</h3>
        </Row>
        <Row type='flex' gutter={GUTTER} justify='space-between'>
          <Col {...COL_PAYMENT}>
            <DynamicComponentWithNoSSR
              getStripeFormRef={this.getStripeFormRef}
              stripePublicKey='pk_test_gxEKMtkVdWvm3LArf1ipX5TX'
              handleResult={this.handleResult}
            />
          </Col>
          <Col {...COL_SUMMARY}>
            {totalPrice &&
              <Card style={{marginTop: '21px'}}>
                <h3>Order summary</h3>
                <p className='large'>{quantity} x Tiny meals @ {formatMoney(perItemPrice)} per cup</p>
                <p className='large'>Every {frequency} weeks -- {formatMoney(totalPrice)} total</p>
                <Form onSave={this.onAddDiscount} fieldSets={[discountCodeFieldSet]} />
              </Card>
            }
          </Col>
        </Row>
        <Spacer />
        <Row type='flex' gutter={GUTTER} justify='space-between'>
          {/* tslint:disable-next-line no-magic-numbers */}
          <Col span={24}>
            <div className='form-account-info'>
              <Form
                fieldSets={fieldSets}
                onSave={this.onSave}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AccountInfoForm;
