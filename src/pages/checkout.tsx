import React from 'react';
import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import { Row } from 'antd';
import AccountInfoForm from '../components/AccountInfoForm';
import { Provider } from 'mobx-react';

const steps = [
  {title: 'Plan Details'},
  {title: 'Select Recipes'},
  {title: 'Checkout'},
];

const getStateOptions = () => [
  {value: 'New Jersey', name: 'New Jersey'},
  {value: 'New York', name: 'New York'},
];

export default () => (
  <Layout title='Checkout Page'>
    <Provider getOptions={getStateOptions}>
      <>
        <Row type='flex' justify='center'>
          <Steps steps={steps} current={2} />
        </Row>

        <Row type='flex' justify='center'>
          <AccountInfoForm />
        </Row>
      </>
    </Provider>
  </Layout>
);
