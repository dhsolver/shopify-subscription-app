import React, { Component } from 'react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Row } from 'antd';
import Router from 'next/router';
import Axios from 'axios';
import store from 'store';
import { omit, isEmpty } from 'lodash';

import { Form } from '@mighty-justice/fields-ant';
import SmartBool from '@mighty-justice/smart-bool';

import { states_hash } from '../constants';

import Spacer from './common/Spacer';
import Alert from './common/Alert';
import Loader from './common/Loader';
import { accountFieldSets } from './accountInfoFieldSets';

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
        first_name: model.billing.first_name,
        last_name: model.billing.last_name,
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
        first_name: model.billing.first_name,
        last_name: model.billing.last_name,
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
      const customerId = rechargeCustomerResponse.customer.id;
      store.set(
        'customerInfo',
        {
          id,
          rechargeId: customerId,
          shopifyCustomerInfo: omit(shopifyCustomerInfo, ['password, password_confirmation']),
        });

      // Google Analytics User Identify
      const nameInfo = store.get('nameInfo');
      const babyInfo = store.get('babyInfo');
      const subscriptionInfo = store.get('subscriptionInfo');
      const gaIdentifyTraits = {
        fist_name: shopifyCustomerInfo.first_name,
        last_name: shopifyCustomerInfo.last_name,
        // email: shopifyCustomerInfo.email,
        pack_size: `${subscriptionInfo.quantity}-pack`,
        order_frequency: subscriptionInfo.frequency,
        child_name: nameInfo.child_name,
        relationship_to_child: nameInfo.relationship_to_child,
        child_birth_date: babyInfo.birthdate,
        child_allerges: isEmpty(babyInfo.has_allergies) ? '' : babyInfo.allergies,
        child_developmental_phase: babyInfo.stage_of_eating,
        child_current_diet: babyInfo.current_diet,
        biggest_feeding_priority: babyInfo.eating_concerns,
      };
      (window as any).analytics.identify(id, gaIdentifyTraits);

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
              resetOnSuccess={false}
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
                  <Spacer />
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
