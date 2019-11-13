import React, { Component } from 'react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Row } from 'antd';
import Router from 'next/router';
import Axios from 'axios';
import store from 'store';
import { get, isEmpty } from 'lodash';

import { Form } from '@mighty-justice/fields-ant';
import SmartBool from '@mighty-justice/smart-bool';

import { states_hash } from '../constants';

import Spacer from './common/Spacer';
import Alert from './common/Alert';
import Loader from './common/Loader';

export const personalInfoFieldSet = {
  fields: [
    { field: 'first_name', required: true },
    { field: 'last_name', required: true },
  ],
  legend: 'Personal Info',
};

export const insertBillingIf = (model: any) => model.billing && !model.billing.is_same_as_shipping;

export const billingAddressFieldSet = {
  fields: [
    {
      className: 'chk-billing',
      editProps: {
        defaultChecked: true,
        description: 'Is Same as Shipping',
      },
      field: 'billing.is_same_as_shipping',
      label: '',
      type: 'checkbox',
      value: true,
    },
    { field: 'billing', type: 'address', insertIf: insertBillingIf },
  ],
  legend: 'Billing Address',
};

// TODO: seriously, why?
const emptyFieldSet = {fields: [], legend: ''};

export const shippingAddressFieldSet = {
  fields: [
    {field: 'first_name', required: true },
    {field: 'last_name', required: true },
    // TODO why is this not autofilling
    {field: 'shipping', type: 'address', required: true },
  ],
  legend: 'Shipping Address',
};

export const accountDetailsFieldSet = {
  fields: [
    {field: 'email', required: true},
    // TODO: why is this not validating
    {field: 'phone', required: true, type: 'phone'},
    {field: 'password', required: true},
    {field: 'password_confirmation', writeOnly: true, label: 'Confirm Password', required: true },
  ],
  legend: 'Account Details',
};

const accountFieldSets = [
  accountDetailsFieldSet,
  shippingAddressFieldSet,
  billingAddressFieldSet,
  emptyFieldSet,
];

@inject('getOptions')
@autoBindMethods
@observer
class AccountInfoForm extends Component <{}> {
  @observable private isAddingDiscount = new SmartBool();
  @observable private isLoading = new SmartBool();
  @observable private stripeToken;
  @observable private discountCode;
  @observable private formMessage;
  @observable private discountMessage;

  public componentDidMount () {
    if (!isEmpty(get(store.get('customerInfo'), 'shopifyCustomerInfo'))) {
      Router.push('/frequency-selection');
    }
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
      province: model.shipping.state,
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

  private async onSave (model: any) {
    this.isLoading.setTrue();
    try {
      const shopifyCustomerInfo = this.serializeShopifyCustomerInfo(model)
        , submitData = {
          metafieldData: this.serializeMetafields(),
          rechargeCustomerInfo: this.serializeRechargeCustomerInfo(model),
          shopifyCustomerInfo,
        }
        ;

      const { data: { id, rechargeCustomerResponse } } = await Axios.post('/recharge-customer-info/', submitData);
      store.set('customerInfo', {id, rechargeId: rechargeCustomerResponse.customer.id, shopifyCustomerInfo});

      Router.push('/checkout');
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

  private afterCloseFormMessage () {
    this.formMessage = null;
  }

  public render () {
    return (
      <Row type='flex' justify='center'>
        <Loader spinning={this.isLoading.isTrue}>
          <Spacer />
          <Row type='flex' justify='center'>
            <h2>Finalize Your Subscription</h2>
          </Row>
          <Spacer />
          <div className='form-wrapper'>
            <Form
              fieldSets={accountFieldSets}
              isLoading={this.isLoading.isTrue}
              onSave={this.onSave}
              saveText='Continue to Payment'
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
        </Loader>
      </Row>
    );
  }
}

export default AccountInfoForm;
