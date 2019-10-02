import React, { Component } from 'react';
import { Form } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Card, Checkbox, Col, Row } from 'antd';
import Router from 'next/router';
import Axios from 'axios';
import store from 'store';
import { get, isEmpty, omit, noop } from 'lodash';
import Decimal from 'decimal.js';

import dynamic from 'next/dynamic';

import Spacer from './common/Spacer';
import { FAMILY_TIME_PRICE, PRICING, states_hash } from '../constants';
import { formatMoney, pluralize } from '@mighty-justice/utils';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';
import Alert from './common/Alert';
import Loader from './common/Loader';

import getConfig from 'next/config';
const { publicRuntimeConfig: { STRIPE_PUBLIC_KEY } } = getConfig();

const StripeForm = dynamic(
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
    {field: 'phone', required: true, type: 'phone'},
    {field: 'password', required: true},
    {field: 'password_confirmation', writeOnly: true, label: 'Confirm Password', required: true },
  ],
  legend: 'Account Details',
};

const termsFieldset = {
  colProps,
  fields: [
    {
      editComponent: (props) => (
        <div>
          <Checkbox {...omit(props, 'value')} checked={props.value}>
            I would like to share my onboarding information.
          </Checkbox>
          <small className='chk-info'>
            {/* tslint:disable-next-line max-line-length */}
            By checking the checkbox above you agree to share your onboarding  information with Tufts School of Nutrition in order to help build the next generation of adventurous eaters.
          </small>
        </div>
      ),
      field: 'share_onboaring_info',
      label: '',
      type: 'checkbox',
      value: false,
    },
    {
      editProps: {
        description: (
          <>
            {/* tslint:disable-next-line max-line-length */}
            I accept the <a href='https://www.tinyorganics.com/pages/terms-and-conditions' target='_blank'>terms and conditions</a>.
          </>
        ),
      },
      field: 'terms_accept',
      label: '',
      type: 'checkbox',
      value: false,
    },
  ],
  legend: '',
};

const fieldSets = [
  shippingAddressFieldSet,
  accountDetailsFieldSet,
  billingAddressFieldSet,
  termsFieldset,
  emptyFieldSet,
];

@inject('getOptions')
@autoBindMethods
@observer
class AccountInfoForm extends Component <{}> {
  @observable private isAddingDiscount = new SmartBool();
  @observable private isLoading = new SmartBool(true);
  @observable private stripeToken;
  @observable private discountCode;
  @observable private pricing: any = {};
  @observable private formMessage;
  @observable private discountMessage;

  public componentDidMount () {
    if (!store.get('product_id') || !store.get('variant_id')) {
      Router.push('/frequency-selection');
    }

    const subscriptionInfo = store.get('subscriptionInfo')
      , quantity = get(subscriptionInfo, 'quantity')
      , frequency = get(subscriptionInfo, 'frequency')
      , perItemPrice = PRICING[24] // All prices currently at $4.69 until price overhaul
      , itemDecimal = new Decimal(perItemPrice)
      , totalPrice = itemDecimal.times(quantity).toDecimalPlaces(2).toString()
      ;

    this.pricing = {quantity, frequency, perItemPrice, totalPrice};
    this.serializeMetafields();
    this.isLoading.setFalse();
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
    this.discountMessage = null;

    const { data } = await Axios.get(`/discounts/${model.discount_code}`);
    if (data.discounts.length) {
      this.discountCode = data.discounts[0];
      this.discountMessage = {type: 'success', message: 'Discount successfully applied!'};
    }
    this.discountMessage = {type: 'error', message: 'This discount code is invalid!'};
  }

  private async onSave (model: any) {
    this.isLoading.setTrue();
    return null;
    if (!model.share_onboaring_info) {
      this.formMessage = {type: 'error', message: 'Oops! Please agree to share your onboaridng info with us.'};
      return null;
    }

    if (!model.terms_accept) {
      this.formMessage = {type: 'error', message: 'Oops! Please agree to our terms and conditions.'};
      return null;
    }

    this.isLoading.setTrue();
    try {
      await this.stripeFormRef.props.onSubmit({preventDefault: noop});
    }
    catch (e) {
      this.formMessage = {type: 'error', message: 'Oops! Please provide a valid payment method!'};
      this.isLoading.setFalse();
      return null;
    }

    try {
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
          shipping_line: {
            handle: get(shippingRates, 'data.shipping_rates[0].handle', 'shopify-Free%20Shipping-0.00'),
          },
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
    catch (e) {
      this.formMessage = {
        message: 'Oops! Something went wrong! Double check your submission and try again',
        type: 'error',
      };
      return null;
    }
    finally {
      this.isLoading.setFalse();
    }
  }

  public handleResult ({token}: any) {
    this.stripeToken = token.id;
  }

  private afterCloseDiscountMessage () {
    this.discountMessage = null;
  }

  private afterCloseFormMessage () {
    this.formMessage = null;
  }

  private renderDiscountForm () {
    return (
      <Form onSave={this.onAddDiscount} fieldSets={[discountCodeFieldSet]} resetOnSuccess={false}>
        {this.discountMessage && (
          <Row className='message-item'>
            <Alert
              afterClose={this.afterCloseDiscountMessage}
              closable
              message={this.discountMessage.message}
              type={this.discountMessage.type}
            />
          </Row>
        )}
      </Form>
    );
  }

  private renderDiscount () {
    if (this.pricing.quantity === 12) {
      return (
        <Row type='flex' justify='space-between'>
          <Col span={16}>
            <p className='large'>$0.80/cup discount automatically applied</p>
          </Col>
          <Col span={4}>
            <p>(-$9.60)</p>
          </Col>
        </Row>
      );
    }

    return this.isAddingDiscount.isTrue
      ? this.renderDiscountForm()
      : <a onClick={this.isAddingDiscount.setTrue}>+ Add discount code/gift card</a>;
  }

  public render () {
    if (isEmpty(this.pricing)) { return <Row type='flex' justify='center'><Loader/></Row>; }
    const {quantity, frequency, perItemPrice, totalPrice} = this.pricing
      , familyTime = store.get('familyTime')
      , familyTimeDecimal = new Decimal(get(familyTime, 'price', 0))
      , cupsTotalDecimal = new Decimal(totalPrice)
      , totalDecimal = cupsTotalDecimal.add(familyTimeDecimal)
      , discountDecimal = this.discountCode && new Decimal(this.discountCode.value).dividedBy(100)
      , discount = this.discountCode && totalDecimal.times(discountDecimal)
      , totalWithDiscount = this.discountCode && totalDecimal.minus(totalDecimal.times(discountDecimal))
      , totalDisplay = formatMoney(discount ? totalWithDiscount.toString() : totalDecimal.toString())
      ;

    return (
      <div>
        <Loader spinning={this.isLoading.isTrue}>
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
              <StripeForm
                getStripeFormRef={this.getStripeFormRef}
                stripePublicKey={STRIPE_PUBLIC_KEY}
                handleResult={this.handleResult}
              />
            </Col>
            <Col {...COL_SUMMARY}>
              {totalPrice &&
                <Card style={{marginTop: '21px'}}>
                  <Row type='flex' justify='center' align='middle'>
                    <h3>Order Summary</h3>
                  </Row>
                  <Spacer small />

                  <Row type='flex' justify='space-between'>
                    <Col span={16}>
                      <p className='large'>
                        {quantity} meal subscription plan every {pluralize('week', 's', frequency)}:
                      </p>
                    </Col>
                    <Col span={4}>
                      <p>{formatMoney(cupsTotalDecimal.toString())}</p>
                    </Col>
                  </Row>

                  {familyTime && (
                    <Row type='flex' justify='space-between'>
                      <Col span={16}>
                        <p className='large'>Family time add-on:</p>
                      </Col>
                      <Col span={4}>
                        <p>{formatMoney(FAMILY_TIME_PRICE)}</p>
                      </Col>
                    </Row>
                  )}

                  <Row type='flex' justify='space-between'>
                    <Col span={16}>
                      <p className='large'>Subtotal:</p>
                    </Col>
                    <Col span={4}>
                      <p>{formatMoney(totalDecimal.toString())}</p>
                    </Col>
                  </Row>

                  <Row type='flex' justify='space-between'>
                    <Col span={16}>
                      <p className='large'>Shipping & Handling:</p>
                    </Col>
                    <Col span={4}>
                      <p>$0.00</p>
                    </Col>
                  </Row>

                  {discount && (
                    <Row type='flex' justify='space-between'>
                      <Col span={16}>
                        <p className='large'>Discount/Gift Card:{'\n'}<i>{this.discountCode.code}</i></p>
                      </Col>
                      <Col span={4}>
                        <p>{discount.toString()} ({this.discountCode.value}%)</p>
                      </Col>
                    </Row>
                  )}

                  <Row type='flex' justify='space-between'>
                    <Col span={16}>
                      <b><p className='large'>Grand Total:</p></b>
                    </Col>
                    <Col span={4}>
                      <b><p>{totalDisplay}<br/><i> + tax</i></p></b>
                    </Col>
                  </Row>

                  <Spacer small />
                  {this.renderDiscount()}
                </Card>
              }
            </Col>
          </Row>
          <Row type='flex' gutter={GUTTER} justify='space-between'>
              {/* tslint:disable-next-line no-magic-numbers */}
              <Col span={24}>
                <div className='form-account-info'>
                  <Form
                    fieldSets={fieldSets}
                    onSave={this.onSave}
                    resetOnSuccess={false}
                  >
                    {this.formMessage && (
                      <div className='message-item'>
                        <Alert
                          afterClose={this.afterCloseFormMessage}
                          closable
                          message={this.formMessage.message}
                          type={this.formMessage.type}
                        />
                      </div>
                    )}
                  </Form>
                </div>
              </Col>
          </Row>
        </Loader>
      </div>
    );
  }
}

export default AccountInfoForm;
