import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';
import store from 'store';
import { get } from 'lodash';
import { observable } from 'mobx';
import Router from 'next/router';
import { Card, Icon, message, Upload } from 'antd';
import Button from './common/Button';
import Spacer from './common/Spacer';
import SmartBool from '@mighty-justice/smart-bool';
import cx from 'classnames';
import Link from 'next/link';

import AWS from 'aws-sdk';

import getConfig from 'next/config';
const { publicRuntimeConfig: { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET } } = getConfig();

function beforeUpload (file) {
  const isLessThan2M = file.size / 1024 / 1024 < 2;
  if (!isLessThan2M) { message.error('Image must smaller than 2MB!'); }
  return isLessThan2M;
}

@autoBindMethods
@observer
class OnboardingFinalSteps extends Component<{}> {
  @observable private isSaving = new SmartBool();
  @observable private name = '';

  public componentDidMount () {
    this.name = get(store.get('nameInfo'), 'child_name', '');
    if (!this.name) { Router.push('/onboarding-name'); }
  }

  private get uploadProps () {
    // tslint:disable-next-line no-this-assignment
    const self = this;
    const key = `${this.name}-${Date.now()}`;
    return {
      beforeUpload,
      customRequest ({
        file,
        onError,
        onSuccess,
      }) {
        self.isSaving.setTrue();
        AWS.config.update({
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        });

        const S3 = new AWS.S3();
        const objParams = { Body: file, Bucket: S3_BUCKET, Key: key };

        S3.putObject(objParams)
          .send(function (err, data: any) {
            if (err) {
              onError();
              self.isSaving.setFalse();
            } else {
              onSuccess(data.response, file);
              store.set('profilePicture', `https://tiny-organics.s3.amazonaws.com/${key}`);
              self.isSaving.setFalse();
            }
          });
      },
      multiple: false,
      showUploadList: false,
    };
  }

  public render () {
    const imageUrl = store.get('profilePicture');

    return (
      <Card className={cx({'ant-card-saving': this.isSaving.isTrue})} style={{textAlign: 'center'}}>
        <Spacer />
        <h2>
          Upload a picture of {this.name}
          <Upload {...this.uploadProps}>
            {imageUrl
              ? <img src={imageUrl} alt='avatar' style={{ width: '150px', height: '150px', borderRadius: '100%'}} />
              : <Button><Icon type='upload' /> Click to Upload</Button>
            }
          </Upload>
        </h2>
        <Spacer large />
        <Link href='/frequency-selection'>
          <Button disabled={this.isSaving.isTrue}>Submit</Button>
        </Link>
      </Card>
    );
  }
}

export default OnboardingFinalSteps;
