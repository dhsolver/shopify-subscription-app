import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import Button from './common/Button';
import { ButtonProps } from 'antd/lib/button';

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

  private renderButtons () {
    const buttonProps: ButtonProps = {
      shape: 'circle',
      size: 'small',
      type: 'default',
    };

    if (this.quantity === 0) {
      return (
        <Button
          {...buttonProps}
          type='primary'
          icon='plus'
          value={1}
          onClick={this.onQuantityChange}
        />
      );
    }
    return (
      <>
        <Button
          {...buttonProps}
          icon='minus'
          value={-1}
          onClick={this.onQuantityChange}
        />
        <span className='selection-buttons-quantity'>{this.quantity}</span>
        <Button
          {...buttonProps}
          icon='plus'
          value={1}
          onClick={this.onQuantityChange}
        />
      </>
    );
  }

  public render () {
    return <div className='selection-buttons'>{this.renderButtons()}</div>;
  }
}

export default SelectionButtons;
