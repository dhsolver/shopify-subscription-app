import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';
import store from 'store';
import { get } from 'lodash';
import { observable } from 'mobx';
import Router from 'next/router';
import { Icon, Upload } from 'antd';
import Button from './common/Button';
import { Form } from '@mighty-justice/fields-ant';

const fieldSets = [[{
  editProps: {defaultChecked: true},
  field: 'share_with_tufts',
  label: 'I would like to share my data with Tuft\'s School of Nutrition',
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
      <div>
        <h2>Upload a picture of {this.name}</h2>
         <Upload>
          <Button>
            <Icon type='upload' /> Click to Upload
          </Button>
        </Upload>
        <Form fieldSets={fieldSets} onSave={this.onSave} saveText={'Next'}/>
      </div>
    );
  }
}

export default OnboardingFinalSteps;
