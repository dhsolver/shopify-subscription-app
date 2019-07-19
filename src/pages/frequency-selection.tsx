import React from 'react';
import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import SubscriptionSelector from '../components/SubscriptionSelector';
import { Row } from 'antd';

const steps = [
  {title: 'Plan Details'},
  {title: 'Select Recipes'},
  {title: 'Checkout'},
];

export default () => (
  <Layout title='Ant Design Page!'>
    <Row type='flex' justify='center'>
      <Steps steps={steps} current={0} />
    </Row>

    <Row type='flex' justify='center'>
      <h2>Select Quantity and Frequency</h2>
    </Row>

    <Row type='flex' justify='center'>
      <p>$4.99 per meal</p>
    </Row>

    <Row type='flex' justify='center'>
      <SubscriptionSelector />
    </Row>
  </Layout>
);
