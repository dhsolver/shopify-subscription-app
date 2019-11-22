import React, { Component } from 'react';
import { Form } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Checkbox, Col, Row } from 'antd';
import Router from 'next/router';
import Axios from 'axios';
import store from 'store';
import { get, isEmpty, omit, noop } from 'lodash';
import Decimal from 'decimal.js';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import Spacer from './common/Spacer';
import TinyLoader from './common/TinyLoader';
import Alert from './common/Alert';
import Loader from './common/Loader';
import { FAMILY_TIME_PRICE, PRICING, states_hash } from '../constants';
import { formatMoney, pluralize } from '@mighty-justice/utils';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';

import getConfig from 'next/config';
const { publicRuntimeConfig: { STRIPE_PUBLIC_KEY } } = getConfig();

const MODES = {
  ACCOUNT_INFO: 'account_info',
  CHECKOUT: 'checkout',
};

const StripeForm = dynamic(
  () => import('./StripeForm'),
  { ssr: false },
);

export const discountCodeFieldSet = {
  fields: [
    { field: 'discount_code' },
  ],
  legend: 'Apply Discount',
};

// TODO: seriously, why?
const emptyFieldSet = {fields: [], legend: ''};

const termsFieldset = {
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

const checkoutFieldSets = [
  termsFieldset,
  emptyFieldSet,
];

@inject('getOptions')
@autoBindMethods
@observer
class CheckoutForm extends Component <{}> {
  @observable private isAddingDiscount = new SmartBool();
  @observable private isLoading = new SmartBool(true);
  @observable private isSaving = new SmartBool();
  @observable private stripeToken;
  @observable private discountCode;
  @observable private pricing: any = {};
  @observable private formMessage;
  @observable private discountMessage;

  public componentDidMount () {
    if (isEmpty(get(store.get('customerInfo'), 'shopifyCustomerInfo'))) {
      Router.push('/account-info');
      return;
    }

    const subscriptionInfo = store.get('subscriptionInfo')
      , quantity = get(subscriptionInfo, 'quantity')
      , frequency = get(subscriptionInfo, 'frequency')
      , perItemPrice = PRICING[12] // All prices currently at $5.49 until price overhaul
      , itemDecimal = new Decimal(perItemPrice)
      , totalPrice = itemDecimal.times(quantity).toDecimalPlaces(2).toString()
      ;

    this.pricing = {quantity, frequency, perItemPrice, totalPrice};

    this.isLoading.setFalse();
  }

  private stripeFormRef;

  private serializeRechargeCheckoutInfo () {
    const { frequency } = store.get('subscriptionInfo')
      , boxItems = store.get('boxItems')
      , { shopifyCustomerInfo } = store.get('customerInfo')
      , lineItems = Object.keys(boxItems).map(id => ({
          charge_interval_frequency: frequency,
          order_interval_frequency: frequency,
          order_interval_unit: 'week',
          product_id: id,
          quantity: boxItems[id].quantity,
          variant_id: boxItems[id].variant_id,
        }))
      ;

    return {
      checkout: {
        discount_code: this.pricing.quantity === 24 ? '24-PRICING-FIX' : get(this.discountCode, 'code'),
        email: shopifyCustomerInfo.email,
        line_items: lineItems.filter(lineItem => lineItem.quantity),
        shipping_address: {...shopifyCustomerInfo.addresses[0], province: shopifyCustomerInfo.province},
      },
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
      return this.discountMessage = {type: 'success', message: 'Discount successfully applied!'};
    }
    return this.discountMessage = {type: 'error', message: 'This discount code is invalid!'};
  }

  private async onSave (model: any) {
    // if (!model.share_onboaring_info) {
    //   this.formMessage = {type: 'error', message: 'Oops! Please agree to share your onboaridng info with us.'};
    //   return null;
    // }

    if (!model.terms_accept) {
      this.formMessage = {type: 'error', message: 'Oops! Please agree to our terms and conditions.'};
      return null;
    }

    this.isSaving.setTrue();
    try {
      await this.stripeFormRef.props.onSubmit({preventDefault: noop});
    }
    catch (e) {
      this.formMessage = {type: 'error', message: 'Oops! Please provide a valid payment method!'};
      this.isSaving.setFalse();
      return null;
    }

    try {
      const rechargeCheckoutData = this.serializeRechargeCheckoutInfo()
        , { rechargeId } = store.get('customerInfo')
        , familyTime = store.get('familyTime')
        , submitData = { rechargeCheckoutData, stripeToken: this.stripeToken }
        ;

      await Axios.post('/checkout/', submitData);

      if (familyTime) {
        const { data: { charges } } = await Axios.get(`/recharge-queued-charges/?customer_id=${rechargeId}`)
          , familyTimeSubmitData = {...familyTime, next_charge_scheduled_at: charges[0].scheduled_at}
          ;
        await Axios.post(`/onetimes/address/${charges[0].address_id}`, familyTimeSubmitData);
      }
      // FullStoryAPI.identify(id, {
      //   displayName: `${shopifyCustomerInfo.first_name} ${shopifyCustomerInfo.last_name}`,
      //   email: `${shopifyCustomerInfo.email}`,
      // });

      Router.push('/order-confirmation');
      return;
    }
    catch (e) {
      this.formMessage = {
        message: 'Oops! Something went wrong! Double check your submission and try again',
        type: 'error',
      };
      return null;
    }
    finally {
      this.isSaving.setFalse();
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
      <Form onSave={this.onAddDiscount} fieldSets={[discountCodeFieldSet]}>
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
    if (this.pricing.quantity === 24) {
      return (
        <Row type='flex' justify='space-between'>
          <Col span={16}>
            <p className='large'>$0.80/cup discount automatically applied</p>
          </Col>
          <Col span={4}>
            <p>(-$19.20)</p>
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

    const {quantity, frequency, totalPrice} = this.pricing
      , familyTime = store.get('familyTime')
      , familyTimeDecimal = new Decimal(get(familyTime, 'price', 0))
      , cupsTotalDecimal = new Decimal(totalPrice)
      , is24 = this.pricing.quantity === 24
      , discount24 = new Decimal(19.2)
      , totalWithAddOnDecimal = cupsTotalDecimal.add(familyTimeDecimal)
      , totalDecimal = is24 ? totalWithAddOnDecimal.minus(discount24) : totalWithAddOnDecimal
      , discountDecimal = this.discountCode && new Decimal(this.discountCode.value).dividedBy(100)
      , discount = this.discountCode && totalDecimal.times(discountDecimal)
      , totalWithDiscount = this.discountCode && totalDecimal.minus(totalDecimal.times(discountDecimal))
      , totalDisplay = formatMoney(discount ? totalWithDiscount.toString() : totalDecimal.toString())
      ;

    return (
      <Row type='flex' justify='center'>
        <Loader spinning={this.isLoading.isTrue}>
          {this.isSaving.isTrue &&
            <TinyLoader>Your order is processing… Please do not refresh, go back, or click again.</TinyLoader>
          }
          <Spacer />
          <div className={cx({'form-saving': this.isSaving.isTrue})}>
            <Row type='flex' justify='center'>
              <h2>Finalize Your Subscription</h2>
            </Row>
            <Spacer />
            <div className='form-wrapper'>
              {totalPrice &&
                <div>
                  <Row type='flex' justify='center'>
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
                </div>
              }
              <Spacer large />
              <Row type='flex' justify='center'>
                <h3>Payment Info</h3>
              </Row>
              <Spacer small />
              <StripeForm
                getStripeFormRef={this.getStripeFormRef}
                stripePublicKey={STRIPE_PUBLIC_KEY}
                handleResult={this.handleResult}
              />
              <Spacer large />
              <Form
                fieldSets={checkoutFieldSets}
                isLoading={this.isSaving.isTrue}
                onSave={this.onSave}
                resetOnSuccess={false}
                saveText='Place Your Order'
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
          </div>
        </Loader>
      </Row>
    );
  }
}

export default CheckoutForm;
