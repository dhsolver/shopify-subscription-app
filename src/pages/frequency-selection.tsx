import React, { Component } from 'react';
import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import SubscriptionSelector from '../components/SubscriptionSelector';
import { Row } from 'antd';
import Spacer from '../components/common/Spacer';

const steps = [
  {title: 'Plan Details'},
  {title: 'Select Recipes'},
  {title: 'Checkout'},
];

export default class FrequencySelectionPage extends Component<{}> {
  public render () {
    return (
      <Layout title='Ant Design Page!'>
        <Row type='flex' justify='center'>
          <Steps steps={steps} current={0} />
        </Row>

        <div style={{textAlign: 'center'}}>
          <Row type='flex' justify='center'>
            <SubscriptionSelector />
          </Row>
        </div>
      </Layout>
    );
  }
}
