import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import Button from './Button';

import SmartBool from '@mighty-justice/smart-bool';
import { FormModal } from '@mighty-justice/fields-ant';

interface IProps {
  buttonProps?: object;
  buttonText?: React.ReactNode;
  ModalClass?: React.ComponentClass<any>;
  passThroughProps?: { [key: string]: any, onCancel?: () => void, onSuccess?: () => void };
}

@autoBindMethods
@observer
class ModalButton extends Component<IProps> {
  @observable public isVisible = new SmartBool();

  private onSuccess () {
    const { passThroughProps } = this.props;
    if (passThroughProps && passThroughProps.onSuccess) { passThroughProps.onSuccess(); }
    this.isVisible.setFalse();
  }

  private onCancel () {
    const { passThroughProps } = this.props;
    if (passThroughProps && passThroughProps.onCancel) { passThroughProps.onCancel(); }
    this.isVisible.setFalse();
  }

  public render () {
    const { buttonProps, buttonText, ModalClass, passThroughProps } = this.props
      , Modal = ModalClass ? ModalClass : FormModal as any;

    return (
      <>
        <Button children={buttonText} {...buttonProps} onClick={this.isVisible.setTrue} />

        {this.isVisible.isTrue &&
          <Modal
            {...passThroughProps}
            isVisible={this.isVisible}
            onCancel={this.onCancel}
            onSuccess={this.onSuccess}
          />
        }
      </>
    );
  }
}

export default ModalButton;
