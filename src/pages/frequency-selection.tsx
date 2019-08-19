import React from 'react';
import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import SubscriptionSelector from '../components/SubscriptionSelector';
import { Row } from 'antd';
import Link from 'next/link';
import Button from '../components/common/Button';
import Spacer from '../components/common/Spacer';

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

    <div style={{textAlign: 'center'}}>
      <Row style={{padding: '30px 0'}}>
        <h2>Select Quantity and Frequency</h2>
        <p>$4.99 per meal</p>
      </Row>

      <Row type='flex' justify='center'>
        <SubscriptionSelector />
      </Row>
      <Spacer />
      <div style={{height: 100}} />
      <Row type='flex' justify='center'>
        <Link href='/recipe-selection'>
          <Button size='large' type='primary'>Next</Button>
        </Link>
      </Row>
    </div>
  </Layout>
);
