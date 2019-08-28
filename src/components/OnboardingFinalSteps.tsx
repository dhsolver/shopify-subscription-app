import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';
import store from 'store';
import { get } from 'lodash';
import { observable } from 'mobx';
import Router from 'next/router';
import { Card, Icon, Upload } from 'antd';
import Button from './common/Button';
import Spacer from './common/Spacer';
import { Form } from '@mighty-justice/fields-ant';

const fieldSets = [[{
  editProps: {defaultChecked: true, description: 'I would like to share my data with Tuft\'s School of Nutrition'},
  field: 'share_with_tufts',
  label: 'I would like to share my data with Tuft\'s School of Nutrition',
  showLabel: false,
  type: 'checkbox',
}]];

@autoBindMethods
@observer
class OnboardingFinalSteps extends Component<{}> {
  @observable private name = '';
  public componentDidMount () {
    this.name = get(JSON.parse(store.get('nameInfo')), 'child_name', '');
    if (!this.name) { Router.push('/onboarding-name'); }
  }

  private onSave (_model) {
    // console.log(_model);
    Router.push('/frequency-selection');
  }

  public render () {
    return (
      <Card style={{textAlign: 'center'}}>
        <Spacer />>
        <h2>
          Upload a picture of {this.name}
          <Upload>
            <Button>
              <Icon type='upload' /> Click to Upload
            </Button>
          </Upload>
        </h2>
        <Spacer large />
        <Form fieldSets={fieldSets} onSave={this.onSave} saveText='Submit' />
      </Card>
    );
  }
}

export default OnboardingFinalSteps;
