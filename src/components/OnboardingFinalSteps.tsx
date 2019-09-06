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
import SmartBool from '@mighty-justice/smart-bool';
import { sleep } from '../utils/utils';
import cx from 'classnames';
import Link from 'next/link';

const SUBMIT_SLEEP = 1500;

@autoBindMethods
@observer
class OnboardingFinalSteps extends Component<{}> {
  @observable private isSaving = new SmartBool();
  @observable private name = '';

  public componentDidMount () {
    this.name = get(JSON.parse(store.get('nameInfo')), 'child_name', '');
    if (!this.name) { Router.push('/onboarding-name'); }
  }

  private async onSave (_model) {
    this.isSaving.setTrue();
    // console.log(_model);
    await sleep(SUBMIT_SLEEP);
    await Router.push('/frequency-selection');
  }

  public render () {
    return (
      <Card className={cx({'ant-card-saving': this.isSaving.isTrue})} style={{textAlign: 'center'}}>
        <Spacer />
        <h2>
          Upload a picture of {this.name}
          <Upload>
            <Button>
              <Icon type='upload' /> Click to Upload
            </Button>
          </Upload>
        </h2>
        <Spacer large />
        <Link href='/frequency-selection'>
          <Button>Submit</Button>
        </Link>
      </Card>
    );
  }
}

export default OnboardingFinalSteps;
