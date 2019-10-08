import React from 'react';
import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import { Row } from 'antd';
import Link from 'next/link';
import Button from '../components/common/Button';
import { Provider } from 'mobx-react';
import { stateOptions } from '../constants';

const steps = [
  {title: 'Me & My Kids', url: '/onboarding-name'},
  {title: 'My Plan', url: '/frequency-selection'},
  {title: 'First Box', url: '/recipe-selection'},
  {title: 'Checkout', url: '/checkout'},
];

const getStateOptions = () => stateOptions;

export default () => (
  <Layout title='Checkout Page'>
    <Provider getOptions={getStateOptions}>
      <>
        <Row type='flex' justify='center'>
          <Steps steps={steps} current={3} />
        </Row>

        <Row type='flex' justify='center'>
          <h2>Congrats! Your order has been placed</h2>
        </Row>

        <Row type='flex' justify='center'>
          <h3>You can manage and view your orders in your account page :)</h3>
        </Row>

        <Row type='flex' justify='center'>
          <Link href='/dashboard'>
            <Button>Dashboard</Button>
          </Link>
        </Row>

      </>
    </Provider>
  </Layout>
);
