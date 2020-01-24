import React from 'react';
import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import { Row } from 'antd';
import Spacer from '../components/common/Spacer';
import Link from 'next/link';
import Button from '../components/common/Button';
import { Provider } from 'mobx-react';
import { stateOptions } from '../constants';

const getStateOptions = () => stateOptions;

// TODO redirect outer link to:
// window.location.href = https://www.tinyorganics.com/account/login

export default () => (
  <Layout title='Order Confirmation'>
    <Provider getOptions={getStateOptions}>
      <>
        <Row type='flex' justify='center'>
          <h3>Your order is confirmed!</h3>
        </Row>
        <Row type='flex' justify='center'>
          <h2>Welcome to the Tiny Family!</h2>
        </Row>
        <Spacer large/>
        <Row type='flex' justify='center' style={{ maxWidth: '600px', margin: 'auto' }}>
          {/* tslint:disable-next-line max-line-length */}
          <h3>We at Tiny are so excited to help introduce your little one to their first 100 flavors! Tiny was designed by a Neonatal Nutritionist to give your child the most nutritious and delicious start possible.</h3>
        </Row>
        <Spacer small/>
        <Row type='flex' justify='center' style={{ maxWidth: '600px', margin: 'auto' }}>
          {/* tslint:disable-next-line max-line-length */}
          <h3>Orders placed before Sunday at 11:59 PM will be delivered on Thursday or Friday. All orders placed after Sunday at 11:59 PM will ship the following week. You will receive a separate email with tracking information when your order ships.</h3>
        </Row>
        <Spacer large/>
        <Row type='flex' justify='center'>
          <Link href='/dashboard'>
            <Button>My Account</Button>
          </Link>
        </Row>
      </>
    </Provider>
  </Layout>
);
