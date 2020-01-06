import React, { Component } from 'react';
import store from 'store';
import { find, get, omit, sum } from 'lodash';
import Axios from 'axios';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';

import Router from 'next/router';
import getConfig from 'next/config';

import { pluralize } from '@mighty-justice/utils';
import SmartBool from '@mighty-justice/smart-bool';
import { Card, fillInFieldSet } from '@mighty-justice/fields-ant';

import { Avatar, Col, Row } from 'antd';

import PersonalInfoForm from './PersonalInfoForm';
import PaymentInfo from './PaymentInfo';
import SubscriptionSelector from './SubscriptionSelector';
import Center from './common/Center';
import Loader from './common/Loader';
import Spacer from './common/Spacer';
import { personalInfoFieldSet, shippingAddressFieldSet } from './accountInfoFieldSets';

import { FAMILY_TIME_PRODUCT_ID, states_hash } from '../constants';

const { publicRuntimeConfig: { STRIPE_PUBLIC_KEY } } = getConfig();

const billingAddressFieldSet = {
  fields: [
    {field: 'billing.first_name', required: true},
    {field: 'billing.last_name', required: true},
    {field: 'billing', type: 'address', showLabel: false},
  ],
  legend: 'Billing Address',
};

const editAccountDetailsFieldSet = {
  fields: [
    {field: 'email', required: true, render: (value: string) => <span className='text-break-word'>{value}</span>},
    {field: 'phone', required: true},
  ],
  legend: 'Account Details',
};

const GUTTER = 48
  , AVATAR_SIZE = 200
  , ITEM_COLS = {xs: 24, md: 12}
  , HEADER_COLS = {xs: 24, sm: 8};

@autoBindMethods
@observer
class Account extends Component<{}> {
  @observable private charges: any = [];
  @observable private subsriptionId: any;
  @observable private quantity = 0;
  @observable private frequency = 0;
  @observable private rechargeId: any;
  @observable private customer: any = {};
  @observable private isEditingSubscriptionDetails = new SmartBool();
  @observable private isLoading = new SmartBool(true);
  @observable private shippingAddress: any = {};
  @observable private paymentSource: any = {};

  private subscriptionSelector: any;
  private stripeFormRef: any;

  public async componentDidMount () {
    this.rechargeId = get(store.get('customerInfo'), 'rechargeId');
    await Promise.all([
      this.fetchCharges(),
      this.fetchCustomerInfo(),
    ]);

    const { data } = await Axios.get(`/subscriptions/${this.subsriptionId}`);
    this.frequency = Number(data.subscription.order_interval_frequency);
  }

  private getStripeFormRef (form: any) {
    this.stripeFormRef = form;
  }

  private async fetchCustomerInfo () {
    const shopifyId = get(store.get('customerInfo'), 'id')
      , rechargeResponse = await Axios.get(`/recharge-customers/${shopifyId}`)
      , stripeToken = get(rechargeResponse, 'data.customers[0].stripe_customer_token')
      , addressesResponse = await Axios.get(`/customers/${shopifyId}/addresses`)
      , paymentResponse = await Axios.get(`/recharge-customers/${stripeToken}/payment_sources`)
      , { data: { default_source, sources } } = paymentResponse
      ;

    this.shippingAddress = find(addressesResponse.data.addresses, {default: true});
    this.paymentSource = sources.data.find(source => source.id === default_source) || sources.data[0];
    this.customer = rechargeResponse.data.customers[0];
    this.isLoading.setFalse();
  }

  public async fetchCharges () {
    if (!this.rechargeId) {
      Router.push('/index');
      return;
    }

    const { data } = await Axios.get(`/recharge-queued-charges/?customer_id=${this.rechargeId}`);

    this.charges = data.charges;
    this.subsriptionId = this.charges[0].line_items[0].subscription_id;
    const lineItems = this.charges[0].line_items.filter(item => item.shopify_product_id !== FAMILY_TIME_PRODUCT_ID);
    this.quantity = sum(lineItems.map(lineItem => lineItem.quantity));
  }

  private serializeRechargeCustomerInfo (model: any) {
    return {
      billing_address1: model.billing.address1,
      billing_address2: model.billing.address2,
      billing_city: model.billing.city,
      billing_country: 'United States',
      billing_first_name: model.billing.first_name,
      billing_last_name: model.billing.last_name,
      billing_phone: model.phone,
      billing_province: model.billing.state,
      billing_zip: model.billing.zip_code,
      email: model.email,
      first_name: model.first_name,
      last_name: model.last_name,
      status: 'ACTIVE',
    };
  }

  private deserializeFormData (model) {
    return {
      'billing': {
        address1: model.billing_address1,
        address2: model.billing_address2,
        city: model.billing_city,
        country: model.billing_country,
        first_name: model.first_name,
        last_name: model.last_name,
        state: model.billing_province,
        zip_code: model.billing_zip,
      },
      'billing.address1': model.billing_address1,
      'billing.address2': model.billing_address2,
      'billing.city': model.billing_city,
      'billing.country': model.billing_country,
      'billing.state': model.billing_province,
      'billing.zip_code': model.billing_zip,
      'email': model.email,
      'first_name': model.first_name,
      'last_name': model.last_name,
      'phone': model.billing_phone,
    };
  }

  private deserializeShippingData (model) {
    return {
      shipping: {
        ...omit(model, 'state', 'zip_code'),
        state: model.province,
        zip_code: model.zip,
      },
      ...omit(model, 'state', 'zip_code'),
      state: model.province,
      zip_code: model.zip,
    };
  }

  private serializeShippingData (model) {
    return {
      address: {
        ...omit(model.shipping, 'state', 'zip_code'),
        country: 'United States',
        first_name: model.first_name,
        id: this.shippingAddress.id,
        last_name: model.last_name,
        province: states_hash[model.shipping.state],
        zip: model.shipping.zip_code,
      },
    };
  }

  private async updateShippingInfo (model) {
    const endpoint = `customers/${this.customer.shopify_customer_id}/addresses/${this.shippingAddress.id}`
      , response = await Axios.put(endpoint, this.serializeShippingData(model));

    this.shippingAddress = response.data.customer_address;
  }

  private renderSubscriptionPlan () {
    return (
      <div>
        <Row type='flex' justify='center'>
          <h3>
            Your plan includes {this.quantity} meals in every order,{' '}
            every {this.frequency} {pluralize('week', 's', this.frequency)}!
          </h3>
          <br/>
        </Row>
      </div>
    );
  }

  private getSubscriptionSelectorRef (component: any) {
    this.subscriptionSelector = component;
  }

  private async onSubscriptionChange () {
    this.frequency = this.subscriptionSelector.selectedSchedule;
    const data = {
        charge_interval_frequency: this.subscriptionSelector.selectedSchedule,
        order_interval_frequency: this.subscriptionSelector.selectedSchedule,
        order_interval_unit: 'week',
      }
      , lineItems = this.charges[0].line_items
      ;

    // tslint:disable-next-line
    for (let i = 0; i < lineItems.length; i += 1) {
      await Axios.put(`/subscriptions/${lineItems[i].subscription_id}`, data);
    }

    await this.fetchCustomerInfo();
    this.isEditingSubscriptionDetails.setFalse();
  }

  private async saveCustomerInfo (model: any) {
    const serializedData = this.serializeRechargeCustomerInfo({...this.deserializeFormData(this.customer), ...model})
      , response = await Axios.put(`/customers/${this.customer.id}/`, serializedData)
      ;

    this.customer = {...this.customer, ...response.data.customer};
  }

  private async handlePaymentInfoChange ({token}: any) {
    await Axios.put(
      `customers/${this.customer.stripe_customer_token}/payment-info`,
      {token: token.id, email: this.customer.email},
    );

    const paymentResponse = await Axios.get(
      `/recharge-customers/${this.customer.stripe_customer_token}/payment_sources?id=${this.customer.id}`,
      )
      , { data: { default_source, sources } } = paymentResponse
      ;

    this.paymentSource = sources.data.find(source => source.id === default_source);
  }

  public render () {
    if (this.isLoading.isTrue) { return <Loader spinning />; }
    const profilePicture = store.get('profilePicture');
    // the following have been disabled until shipping address routes to recharge instead of shopify
    // personal info (first/last name) should tie to billing information
    // <Row>
    //   <PersonalInfoForm
    //     model={this.deserializeFormData(this.customer)}
    //     fieldSet={fillInFieldSet(personalInfoFieldSet)}
    //     onSave={this.saveCustomerInfo}
    //   />
    // </Row>
    //   <Row>
    //     <PersonalInfoForm
    //       model={this.deserializeShippingData(this.shippingAddress)}
    //       fieldSet={fillInFieldSet(shippingAddressFieldSet)}
    //       onSave={this.updateShippingInfo}
    //     />
    //   </Row>

    return (
      <>
        <Spacer large />
        <Row gutter={GUTTER}>
          <Col {...ITEM_COLS}>
            <Card fieldSets={[]}>
              <Center>
                {this.isEditingSubscriptionDetails.isTrue
                  ? <SubscriptionSelector ref={this.getSubscriptionSelectorRef} omitNext omitQuantity />
                  : this.renderSubscriptionPlan()
                }
                <small>
                  * Please send us a chat or email us at hello@tinyorganics.com to
                  update your shipping address or subscription{' '}
                  details. You can always change your recipe selection in the Orders{' '}
                  tab above. More features coming soon!
                </small>
              </Center>
            </Card>
            <Row>
              <PersonalInfoForm
                model={this.deserializeFormData(this.customer)}
                fieldSet={fillInFieldSet(editAccountDetailsFieldSet)}
                onSave={this.saveCustomerInfo}
              />
            </Row>
          </Col>
          <Col {...ITEM_COLS}>
            <Row>
              <PaymentInfo
                getStripeFormRef={this.getStripeFormRef}
                stripePublicKey={STRIPE_PUBLIC_KEY}
                handleResult={this.handlePaymentInfoChange}
                model={this.paymentSource}
              />
            </Row>
            <Row>
              <PersonalInfoForm
                model={this.deserializeFormData(this.customer)}
                fieldSet={fillInFieldSet(billingAddressFieldSet)}
                onSave={this.saveCustomerInfo}
              />
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}

export default Account;
