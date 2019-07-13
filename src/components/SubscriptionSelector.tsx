// tslint:disable no-magic-numbers

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import Button from './common/Button';

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
        <div>
          <span>
            I want to receive <span style={{fontSize: '16px'}}>{this.selectedQuantity}</span> meals in every order
          </span>
          <br/>
          <Button
            style={
              {
                backgroundColor: this.selectedQuantity === 12 ? 'blue' : 'white',
                border: '0',
                borderRadius: '0',
                margin: '0',
              }
            }
            value={12}
            onClick={this.onChangeQuantity}
          >
            12
          </Button>
          <Button
            style={
              {
                backgroundColor: this.selectedQuantity === 24 ? 'blue' : 'white',
                border: '0',
                borderRadius: '0',
                margin: '0',
              }
            }
            value={24}
            onClick={this.onChangeQuantity}
          >
            24
          </Button>
        </div>
        <div>
          <span>
            I want to receive an order every<span style={{fontSize: '16px'}}>{this.selectedSchedule}</span> Weeks
          </span>
          <br/>
          <Button
            style={
              {
                backgroundColor: this.selectedSchedule === 2 ? 'blue' : 'white',
                border: '0',
                borderRadius: '0',
                margin: '0',
              }
            }
            value={2}
            onClick={this.onChangeSchedule}
          >
            2
          </Button>
          <Button
            style={
              {
                backgroundColor: this.selectedSchedule === 4 ? 'blue' : 'white',
                border: '0',
                borderRadius: '0',
                margin: '0',
              }
            }
            value={4}
            onClick={this.onChangeSchedule}
          >
            4
          </Button>
        </div>
      </div>
    );
  }
}

export default SubscriptionSelector;
