import React from 'react';
import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import { Row } from 'antd';
import AccountInfoForm from '../components/AccountInfoForm';
import { Provider } from 'mobx-react';
import { stateOptions } from '../constants';

const steps = [
  {title: 'Plan Details', url: '/frequency-selection'},
  {title: 'Select Recipes', url: '/recipe-selection'},
  {title: 'Checkout', url: '/checkout'},
];

const getStateOptions = () => stateOptions;

export default () => (
  <Layout title='Checkout Page'>
    <Provider getOptions={getStateOptions}>
      <div className='page-checkout'>
        <Row type='flex' justify='center'>
          <Steps steps={steps} current={2} />
        </Row>

        <AccountInfoForm />
      </div>
    </Provider>
  </Layout>
);
