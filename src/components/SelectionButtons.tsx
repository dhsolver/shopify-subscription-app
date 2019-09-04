import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import Button from './common/Button';
import { ButtonProps } from 'antd/lib/button';

interface IProps {
  disabled?: boolean;
  onChange: (quantity: number) => any;
  quantity?: number;
}

@autoBindMethods
@observer
class SelectionButtons extends Component <IProps> {
  @observable private quantity = 0;

  public componentWillReceiveProps (nextProps: Readonly<IProps>) {
    if (nextProps.quantity !== this.quantity) {
      this.quantity = 0;
      this.onQuantityChange({target: {value: nextProps.quantity || 0}});
    }
  }

  private onQuantityChange (event: any) {
    this.quantity += Number(event.target.value);
    this.props.onChange(Number(event.target.value));
  }

  private renderButtons () {
    const buttonProps: ButtonProps = {
        shape: 'circle',
        size: 'small',
        type: 'default',
      }
      ;

    if (this.quantity === 0) {
      return (
        <>
          <Button
            {...buttonProps}
            disabled={this.props.disabled}
            icon='plus'
            onClick={this.onQuantityChange}
            type='primary'
            value={1}
          />
        </>
      );
    }
    return (
      <>
        <Button
          {...buttonProps}
          icon='minus'
          onClick={this.onQuantityChange}
          value={-1}
        />
        <span className='selection-buttons-quantity'>{this.quantity}</span>
        <Button
          {...buttonProps}
          disabled={this.props.disabled}
          icon='plus'
          onClick={this.onQuantityChange}
          value={1}
        />
      </>
    );
  }

  public render () {
    return <div className='selection-buttons'>{this.renderButtons()}</div>;
  }
}

export default SelectionButtons;
