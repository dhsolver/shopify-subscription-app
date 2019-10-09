import React, { Component } from 'react';
import { Card, FormCard } from '@mighty-justice/fields-ant';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';
import { IconButton } from './common/Button';
import { Icon } from 'antd';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';
import StripeForm from './StripeForm';

interface IProps {
  // fieldSet: any;
  model: any;
  // onSave: (model: any) => void;
  getStripeFormRef: any;
  stripePublicKey: any;
  handleResult: any;
}

export const paymentInfoFieldSet = {
  fields: [
    {field: 'card_brand', required: true },
    {field: 'card_exp_month', required: true },
    {field: 'card_exp_year', required: true },
    {field: 'card_last4', required: true },
  ],
  legend: 'Payment Information',
};

@autoBindMethods
@observer
class PaymentInfoForm extends Component<IProps> {
  @observable private isEditing = new SmartBool();

  private async onSave (model) {
    await this.props.handleResult(model);

    this.isEditing.setFalse();
  }

  private serializeCardData (model) {
    if (!model || !model.card) { return null; }

    return {
      card_brand: model.card.brand,
      card_exp_month: model.card.exp_month,
      card_exp_year: model.card.exp_year,
      card_last4: model.card.last4,
    };
  }

  private renderEditIcon () {
    return (
      <>
        {
          this.isEditing.isTrue
            ? null
            // ? <IconButton icon={this.submit} onClick={this.isEditing.setFalse} />
            : <IconButton icon={this.pencil} onClick={this.isEditing.setTrue} />
        }
      </>
    );
  }

  // TODO: MAKE THIS DESIGN ACTUALLY WORK
  // private get submit () { return () => <Icon type='check' />; }
  private get pencil () { return () => <Icon type='edit' />; }

  public render () {
    const { model } = this.props;

    return (
      <div>
        {
          this.isEditing.isTrue
            ? <StripeForm
                getStripeFormRef={this.props.getStripeFormRef}
                stripePublicKey={this.props.stripePublicKey}
                handleResult={this.onSave}
                isAccountPage
            />
            : <Card
                className='ant-card-ghost'
                fieldSets={[paymentInfoFieldSet]}
                model={this.serializeCardData(model) || {}}
                renderTopRight={this.renderEditIcon}
                title={paymentInfoFieldSet.legend}
            />
        }
      </div>
    );
  }
}

export default PaymentInfoForm;
