import React, { Component } from 'react';
import { Card, FormCard, IFieldSet } from '@mighty-justice/fields-ant';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';
import { IconButton } from './common/Button';
import { Icon } from 'antd';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';

interface IProps {
  fieldSet: IFieldSet;
}

const FieldsFormCard = FormCard as any;

@autoBindMethods
@observer
class PersonalInfoForm extends Component<IProps> {
  @observable private isEditing = new SmartBool();
  private renderEditIcon () {
    return (
      <>
        {
          this.isEditing.isTrue
            ? <IconButton icon={this.submit} onClick={this.isEditing.setFalse} />
            : <IconButton icon={this.pencil} onClick={this.isEditing.setTrue} />
        }
      </>
    );
  }

  private get submit () { return () => <Icon type='check' />; }
  private get pencil () { return () => <Icon type='edit' />; }

  public render () {
    const { fieldSet } = this.props;

    return (
      <div>
        {
          this.isEditing.isTrue
            ? <FieldsFormCard
              model={{}}
              fieldSets={[fieldSet]}
              showControls={false}
              renderTopRight={this.renderEditIcon}
            />
            : <Card fieldSets={[fieldSet]} renderTopRight={this.renderEditIcon}/>
        }
      </div>
    );
  }
}

export default PersonalInfoForm;
