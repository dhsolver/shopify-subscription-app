// tslint:disable no-magic-numbers

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import { Row } from 'antd';
import QuantitySelector from './common/QuantitySelector';
import Spacer from '../components/common/Spacer';

@autoBindMethods
@observer
class SubscriptionSelector extends Component <{}> {
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

  public render () {
    return (
      <div>
        <Row type='flex' justify='center'>
          <p>
            I want to receive <span style={{fontSize: '16px'}}>{this.selectedQuantity}</span> meals in every order
          </p>
          <br/>
        </Row>
        <Row type='flex' justify='center'>
          <QuantitySelector
            defaultValue='12'
            size='large'
            value={this.selectedQuantity}
            onChange={this.onChangeQuantity}
          >
            <QuantitySelector.Button value={12}>12</QuantitySelector.Button>
            <QuantitySelector.Button value={24}>24</QuantitySelector.Button>
          </QuantitySelector>
        </Row>
        <Spacer />
        <Row type='flex' justify='center'>
          <p>
            I want to receive an order every <span style={{fontSize: '16px'}}>{this.selectedSchedule}</span> Weeks
          </p>
        </Row>
        <Row type='flex' justify='center'>
          <QuantitySelector
            defaultValue='2'
            size='large'
            value={this.selectedSchedule}
            onChange={this.onChangeSchedule}
          >
            <QuantitySelector.Button value={2}>2</QuantitySelector.Button>
            <QuantitySelector.Button value={4}>4</QuantitySelector.Button>
          </QuantitySelector>
        </Row>
        <Spacer />
      </div>
    );
  }
}

export default SubscriptionSelector;
