import React, { Component } from 'react';
import { Card, FormCard } from '@mighty-justice/fields-ant';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';
import { IconButton } from './common/Button';
import { Icon } from 'antd';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';

interface IProps {
  fieldSet: any;
  model: any;
  onSave: (model: any) => void;
}

const FieldsFormCard = FormCard as any;

@autoBindMethods
@observer
class PersonalInfoForm extends Component<IProps> {
  @observable private isEditing = new SmartBool();

  private async onSave (model) {
    await this.props.onSave(model);
    this.isEditing.setFalse();
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
    const { fieldSet, model } = this.props
      , simpleFieldSet = {...fieldSet, legend: null};
    return (
      <div>
        {
          this.isEditing.isTrue
            ? <FieldsFormCard
                className='ant-card-ghost'
                fieldSets={[simpleFieldSet]}
                model={model || {}}
                onSave={this.onSave}
                onCancel={this.isEditing.toggle}
                // renderTopRight={this.renderEditIcon}
                // showControls={false}
                title={fieldSet.legend}
            />
            : <Card
                className='ant-card-ghost'
                fieldSets={[simpleFieldSet]}
                model={model || {}}
                renderTopRight={this.renderEditIcon}
                title={fieldSet.legend}
            />
        }
      </div>
    );
  }
}

export default PersonalInfoForm;
