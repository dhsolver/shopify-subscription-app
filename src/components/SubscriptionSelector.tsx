// tslint:disable no-magic-numbers

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import { Radio, Row } from 'antd';

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
          <span>
            I want to receive <span style={{fontSize: '16px'}}>{this.selectedQuantity}</span> meals in every order
          </span>
          <br/>
        </Row>
        <Row type='flex' justify='center'>
          <Radio.Group defaultValue='12' size='large' value={this.selectedQuantity} onChange={this.onChangeQuantity}>
            <Radio.Button value={12}>12</Radio.Button>
            <Radio.Button value={24}>24</Radio.Button>
          </Radio.Group>
        </Row>
        <Row type='flex' justify='center'>
          <span>
            I want to receive an order every <span style={{fontSize: '16px'}}>{this.selectedSchedule}</span> Weeks
          </span>
          <br/>
        </Row>
        <Row type='flex' justify='center'>
          <Radio.Group defaultValue='2' size='large' value={this.selectedSchedule} onChange={this.onChangeSchedule}>
            <Radio.Button value={2}>2</Radio.Button>
            <Radio.Button value={4}>4</Radio.Button>
          </Radio.Group>
        </Row>
      </div>
    );
  }
}

export default SubscriptionSelector;
