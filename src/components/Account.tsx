import React, { Component } from 'react';
import store from 'store';
import { get, noop } from 'lodash';

import { Avatar, Col, Icon, message, notification, Row } from 'antd';

import { Card, fillInFieldSet } from '@mighty-justice/fields-ant';

import {
  personalInfoFieldSet,
  shippingAddressFieldSet,
} from './AccountInfoForm';

import Center from './common/Center';
import Spacer from './common/Spacer';

const billingAddressFieldSet = {
  fields: [{field: 'billing', type: 'address'}],
  legend: 'Billing Address',
};

const editAccountDetailsFieldSet = {
  fields: [
    {field: 'email', required: true},
    {field: 'phone', required: true},
  ],
  legend: 'Account Details',
};

const editIcon = () => <Icon type='edit' />;
const submitIcon = () => <Icon type='check' />;

import PersonalInfoForm from './PersonalInfoForm';
import SubscriptionSelector from './SubscriptionSelector';
import Axios from 'axios';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';
import { IconButton } from './common/Button';

const GUTTER = 48
  , AVATAR_SIZE = 200
  , ITEM_COLS = {xs: 24, md: 12}
  , HEADER_COLS = {xs: 24, sm: 8};

@autoBindMethods
@observer
class Account extends Component<{}> {
  @observable private customer: any = {};
  @observable private isEditingSubscriptionDetails = new SmartBool();
  @observable private isLoading = new SmartBool(true);

  private subscriptionSelector: any;

  public async componentDidMount () {
    const rechargeId = get(store.get('customerInfo'), 'rechargeId')
      , response = await Axios.get(`/recharge-customers/${rechargeId}`)
      ;

    this.customer = response.data.customer;
    this.isLoading.setFalse();
  }

  private serializeRechargeCustomerInfo (model: any) {
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

  private deserializeFormData (model) {
    return {
      'billing': {
        address1: model.billing_address1,
        address2: model.billing_address2,
        city: model.billing_city,
        country: model.billing_country,
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
      // TODO reconcile w/ shopify user info
      'shipping': {
        address1: model.billing_address1,
        address2: model.billing_address2,
        city: model.billing_city,
        country: model.billing_country,
        state: model.billing_province,
        zip_code: model.billing_zip,
      },
      // TODO make shipping address actually shipping address
      'shipping.address1': model.billing_address1,
      'shipping.address2': model.billing_address2,
      'shipping.city': model.billing_city,
      'shipping.country': model.billing_country,
      'shipping.state': model.billing_province,
      'shipping.zip_code': model.billing_zip,
    };
  }

  private renderSubscriptionPlan () {
    return (
      <div>
        <Row type='flex' justify='center'>
          <h3>
            Your plan includes 12 meals in every order, every 2 weeks!
          </h3>
          <br/>
        </Row>
      </div>
    );
  }

  private getSubscriptionSelectorRef (component: any) {
    this.subscriptionSelector = component;
  }

  private onSubscriptionChange () {

    const data = {
      charge_interval_frequency: this.subscriptionSelector.selectedSchedule,
      order_interval_frequency: this.subscriptionSelector.selectedSchedule,
      order_interval_unit: 'week',
    };

    notification.success({
      description: JSON.stringify(data),
      message: 'TODO: MAKE THIS EDIT THE SUBSCRIPTION INTERVAL',
    });

    this.isEditingSubscriptionDetails.setFalse();
  }

  private async saveCustomerInfo (model: any) {
    const serializedData = this.serializeRechargeCustomerInfo({...this.deserializeFormData(this.customer), ...model})
      , response = await Axios.put(`/customers/${this.customer.id}/`, serializedData)
      ;

    this.customer = {...this.customer, ...response.data.customer};
  }

  private saveShippingInfo (model: any) {
    notification.success({
      description: JSON.stringify(model),
      message: 'TODO: MAKE THIS UPDATE SHIPPING INFO',
    });
  }

  public render () {
    if (this.isLoading.isTrue) { return 'loading......'; }
    const profilePicture = store.get('profilePicture');

    return (
      <Row>
        <Spacer />
        <Center>
          <h2>Sebi's Account</h2>
          <Spacer />
          {profilePicture && (
            <Row gutter={GUTTER} type='flex' justify='center'>
              <Col {...HEADER_COLS}>
                <Avatar size={AVATAR_SIZE} src={profilePicture} />
              </Col>
            </Row>
          )}
        </Center>
        <Spacer large />
        <Row gutter={GUTTER}>
          <Col {...ITEM_COLS}>
            <Row>
              <PersonalInfoForm
                model={this.deserializeFormData(this.customer)}
                fieldSet={fillInFieldSet(personalInfoFieldSet)}
                onSave={this.saveCustomerInfo}
              />
            </Row>
            <Row>
              <PersonalInfoForm
                model={this.deserializeFormData(this.customer)}
                fieldSet={fillInFieldSet(shippingAddressFieldSet)}
                onSave={this.saveShippingInfo}
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

          <Col {...ITEM_COLS}>
            <Card fieldSets={[]}>
              <Row type='flex' justify='end'>
                {this.isEditingSubscriptionDetails.isTrue
                  ? <IconButton icon={submitIcon} onClick={this.onSubscriptionChange}/>
                  : <IconButton icon={editIcon} onClick={this.isEditingSubscriptionDetails.setTrue}/>
                }
              </Row>
              <Center>
                {this.isEditingSubscriptionDetails.isTrue
                  ? <SubscriptionSelector ref={this.getSubscriptionSelectorRef} omitNext omitQuantity />
                  : this.renderSubscriptionPlan()
                }
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
        </Row>
      </Row>
    );
  }
}

export default Account;
