import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import store from 'store';
import Link from 'next/link';
import { Row } from 'antd';
import { pluralize } from '@mighty-justice/utils';
import SmartBool from '@mighty-justice/smart-bool';

import Button from '../components/common/Button';
import QuantitySelector from './common/QuantitySelector';
import Spacer from './common/Spacer';

import { PRICING } from '../constants';

interface IProps {
  omitNext?: boolean;
  omitQuantity?: boolean;
}

@autoBindMethods
@observer

class SubscriptionSelector extends Component <IProps> {
  @observable private isNavigating = new SmartBool();
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
    this.isNavigating.setTrue();
    store.set('subscriptionInfo', {quantity: this.selectedQuantity, frequency: this.selectedSchedule});
    if (store.get('boxItems')) { store.remove('boxItems'); }
  }

  public render () {
    return (
      <div>
        <Row style={{padding: '20px 0'}}>
          <h2>Select Quantity and Frequency</h2>
        </Row>
        <Row >
          <h3>${PRICING[this.selectedQuantity]} per meal</h3>
        </Row>
        <Spacer small />
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
        <Spacer />
        <Spacer />
        <Row>
          <h4>
            No commitment! Cancel any time!
          </h4>
        </Row>
        <Spacer />
        {!this.props.omitNext && (
          <>
            <Row type='flex' justify='center'>
              <Link href='/recipe-selection'>
                <Button
                  size='large'
                  type='primary'
                  loading={this.isNavigating.isTrue}
                  onClick={this.save}
                  className='save-plan-selection'
                >
                  Next
                </Button>
              </Link>
            </Row>
          </>
        )}
      </div>
    );
  }
}

export default SubscriptionSelector;
