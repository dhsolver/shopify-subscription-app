// tslint:disable no-magic-numbers

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';

import { Row } from 'antd';

import QuantitySelector from './common/QuantitySelector';
import { PRICING, PRODUCT_ID, VARIANT_ID } from '../constants';
import Link from 'next/link';
import Button from '../components/common/Button';
import store from 'store';
import Spacer from './common/Spacer';
import { pluralize } from '@mighty-justice/utils';

interface IProps {
  omitNext?: boolean;
  omitQuantity?: boolean;
}

@autoBindMethods
@observer
class SubscriptionSelector extends Component <IProps> {
  @observable private selectedQuantity = 12;
  @observable private selectedSchedule = 2;

  private onChangeQuantity (event: any) {
    const { target: { value } } = event;

    this.selectedQuantity = Number(value);
  }

  private onChangeSchedule (event: any) {
    const { target: { value } } = event;

    this.selectedSchedule = Number(value);
  }

  private save () {
    store.set('subscriptionInfo', {quantity: this.selectedQuantity, frequency: this.selectedSchedule});
    store.set('product_id', PRODUCT_ID[this.selectedQuantity]);
    store.set('variant_id', VARIANT_ID[this.selectedQuantity]);
  }

  public render () {
    return (
      <div>
        <Row style={{padding: '30px 0'}}>
          <h2>Select Quantity and Frequency</h2>
          <p>${PRICING[this.selectedQuantity]} per meal</p>
        </Row>
        <Row type='flex' justify='center'>
          <p>
            I want to receive <span style={{fontSize: '16px'}}>{this.selectedQuantity}</span> meals in every order
          </p>
          <br/>
        </Row>
        <Row type='flex' justify='center'>
          {!this.props.omitQuantity &&
            <QuantitySelector
              defaultValue='12'
              size='large'
              value={this.selectedQuantity}
              onChange={this.onChangeQuantity}
            >
              <QuantitySelector.Button value={12}>12</QuantitySelector.Button>
              <QuantitySelector.Button value={24}>24</QuantitySelector.Button>
            </QuantitySelector>
          }
        </Row>
        <Spacer />
        <Row type='flex' justify='center'>
          <p>
            I want to receive an order every <span style={{fontSize: '16px'}}>{this.selectedSchedule}{' '}</span>{' '}
            {pluralize('week', 's', this.selectedSchedule)}
          </p>
        </Row>
        <Row type='flex' justify='center'>
          <QuantitySelector
            defaultValue='2'
            size='large'
            value={this.selectedSchedule}
            onChange={this.onChangeSchedule}
          >
            <QuantitySelector.Button value={1}>1</QuantitySelector.Button>
            <QuantitySelector.Button value={2}>2</QuantitySelector.Button>
            <QuantitySelector.Button value={4}>4</QuantitySelector.Button>
          </QuantitySelector>
        </Row>
        {!this.props.omitNext && (
          <>
            <Spacer />
            <Spacer />
            <div style={{height: 100}} />
            <Row type='flex' justify='center'>
              <Link href='/recipe-selection'>
                <Button size='large' type='primary' onClick={this.save}>Next</Button>
              </Link>
            </Row>
          </>
        )}
      </div>
    );
  }
}

export default SubscriptionSelector;
