import React, { Component } from 'react';
import { Form } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Col, Row } from 'antd';
import Button from './common/Button';

const colProps = { span: 12 };
const GUTTER = 48;

@inject('getOptions')
@autoBindMethods
@observer
class AccountInfoForm extends Component <{}> {
  private get fieldSets () {
    const paymentInfoFieldSet = {
      colProps,
      fields: [
        { field: 'payment_info.first_name' },
        { field: 'payment_info.last_name' },
        { field: 'payment_info.credit_card_number' },
        { field: 'payment_info.expiration_date' },
        { field: 'payment_info.cvv,', label: 'CVV' },
      ],
      legend: 'Payment Info',
    };

    const insertBillingIf = (model: any) => model.billing_address.is_same_as_shipping;

    const billingAddressFieldSet = {
      colProps,
      fields: [
        { field: 'billing_address.is_same_as_shipping', type: 'checkbox' },
        { field: 'billing_address', type: 'address', insertIf: insertBillingIf },
      ],
      legend: 'Billing Address',
    };

    const discountCodeFieldSet = {
      colProps,
      fields: [
        { field: 'discount_code' },
      ],
      legend: 'Apply Discount',
    };

    const shippingAddressFieldSet = {
      colProps,
      fields: [
        {field: 'first_name'},
        {field: 'last_name'},
        {field: 'shipping_address', type: 'address'},
      ],
      legend: 'Shipping Address',
    };

    const accountDetailsFieldSet = {
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

    return {fieldSetsLeft, fieldSetsRight};
  }

  private onSave (model: any) {
    // tslint:disable-next-line
    console.log(model);
  }

  public render () {
    return (
      <Row>
        <form onSubmit={this.onSave}>
          <Row type='flex' justify='center'>
            <h2>Finalize Your Subscription!</h2>
          </Row>
          <Row>
            <br/>
          </Row>
          <Row type='flex' gutter={GUTTER} justify='space-between'>
            <Col span={12}>
              <Form fieldSets={this.fieldSets.fieldSetsLeft} onSave={this.onSave} showControls={false} />
            </Col>
            <Col span={12}>
              <Form fieldSets={this.fieldSets.fieldSetsRight} onSave={this.onSave} showControls={false} />
            </Col>
          </Row>
          <Row type='flex' justify='center'>
            <Button>Submit</Button>
          </Row>
        </form>
      </Row>
    );
  }
}

export default AccountInfoForm;
