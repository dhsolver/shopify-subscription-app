import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import store from 'store';
import { get } from 'lodash';
import cx from 'classnames';
import AWS from 'aws-sdk';

import Link from 'next/link';
import getConfig from 'next/config';

import SmartBool from '@mighty-justice/smart-bool';

import { Card, Icon, message, Upload } from 'antd';

import Button from './common/Button';
import Spacer from './common/Spacer';

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

  private renderPhoto (imageUrl: string) {
    return (
      <div className='avatar-wrapper'>
        <img src={imageUrl} alt='avatar' />
      </div>
    );
  }

  private renderUploadButton () {
    return (
      <Button disabled={this.isSaving.isTrue}>
        {this.isSaving.isTrue ? <Icon type='loading' /> : <Icon type='upload' />} Click to Upload
      </Button>
    );
  }

  public render () {
    const imageUrl = store.get('profilePicture');

    return (
      <Card className={cx({'ant-card-saving': this.isSaving.isTrue})} style={{textAlign: 'center'}}>
        <Spacer />
        <h2>
          Upload a picture of {this.name} eating for your account page!
          (optional)
          <Spacer />
          <Upload {...this.uploadProps}>
            {imageUrl
              ? this.renderPhoto(imageUrl)
              : this.renderUploadButton()
            }
          </Upload>
        </h2>
        <Spacer large />
        <Link href='/frequency-selection'>
          <Button type='primary' size='large' loading={this.isSaving.isTrue} onClick={this.isSaving.setTrue}>
            Next
          </Button>
        </Link>
      </Card>
    );
  }
}

export default OnboardingFinalSteps;
