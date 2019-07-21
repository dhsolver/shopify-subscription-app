import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import Button from './common/Button';

interface IProps {
  onChange: (quantity: number) => any;
}

@autoBindMethods
@observer
class SelectionButtons extends Component <IProps> {
  @observable private quantity = 0;

  private onQuantityChange (event: any) {
    this.quantity += Number(event.target.value);
    this.props.onChange(Number(event.target.value));
  }

  public render () {
    if (this.quantity === 0) {
      return (
        <Button
          value={1}
          style={{borderRadius: '100%'}}
          onClick={this.onQuantityChange}
        >
          +
        </Button>
      );
    }
    return (
      <>
        <Button
          value={-1}
          style={{borderRadius: '100%'}}
          onClick={this.onQuantityChange}
        >
          -
        </Button>
        {this.quantity}
        <Button
          value={1}
          style={{borderRadius: '100%'}}
          onClick={this.onQuantityChange}
        >
          +
        </Button>
      </>
    );
  }
}

export default SelectionButtons;
