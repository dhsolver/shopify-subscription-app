import React, { Component } from 'react';
import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import SubscriptionSelector from '../components/SubscriptionSelector';
import { Row } from 'antd';

const steps = [
  {title: 'Plan Details', url: '/frequency-selection'},
  {title: 'Select Recipes', url: '/recipe-selection'},
  {title: 'Checkout', url: '/checkout'},
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
