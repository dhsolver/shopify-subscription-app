import React from 'react';
import { observer } from 'mobx-react';
import { noop } from 'lodash';
import dynamic from 'next/dynamic';

import Carousel from './common/Carousel';
import Switch from './common/Switch';
import Tabs from './common/Tabs';
import Steps from './common/Steps';
import SubscriptionSelector from './SubscriptionSelector';
import PersonalInfoForm from './PersonalInfoForm';
import { FormModal } from '@mighty-justice/fields-ant';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';
import Button from './common/Button';

const ReferralLink = dynamic(import ('./common/ReferralLink'), { ssr: false });

const fieldSets = [
  {
    fields: [
      {field: 'child_first_name', label: 'First Name'},
      {field: 'child_last_name', label: 'Last Name'},
      {field: 'birthdate', type: 'date'},
    ],
    legend: 'About your little one',
  },
  {
    fields: [
      {field: 'parent_first_name', label: 'First Name'},
      {field: 'parent_last_name', label: 'Last Name'},
      {field: 'phone_number', type: 'phone'},
      {field: 'email'},
    ],
    legend: 'About you',
  },
  {
    fields: [
      {field: 'delivery_date', type: 'datepicker'},
    ],
    legend: 'About your order',
  },
];

@observer
class Demo extends React.Component <{}> {
  @observable private isVisible = new SmartBool();
  @observable private submittedData: any;

  private onSave (data: any) {
    this.submittedData = data;
  }

  public render () {
    return (
      <div>
        <PersonalInfoForm />

        <Carousel />

        <Switch onChange={noop} />

        <Tabs />

        <Steps/>

        <SubscriptionSelector />

        <ReferralLink />

        <Button type='primary' onClick={this.isVisible.setTrue}>CLICK ME</Button>
        <FormModal
          cancelText='Nah, man'
          saveText='Alrighty then!'
          fieldSets={fieldSets}
          isVisible={this.isVisible}
          model={{}}
          onSave={this.onSave}
          title={'Let\'s fill out a form'}
        />
        {this.submittedData && Object.keys(this.submittedData).map(key => (
          <p>
            {`${key} => ${this.submittedData[key]}`}
          </p>
        ))}

      </div>
    );
  }
}

export default Demo;
