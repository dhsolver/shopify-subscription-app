import React from 'react';
import { Row } from 'antd';
import { Provider } from 'mobx-react';

import { stateOptions } from '../constants';
import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import AccountInfoForm from '../components/AccountInfoForm';

const steps = [
  {title: 'Me & My Kids', url: '/onboarding-name'},
  {title: 'My Plan', url: '/frequency-selection'},
  {title: 'Checkout', url: '/checkout'},
];

const getStateOptions = () => stateOptions;

export default () => (
  <Layout title='Account Information'>
    <Provider getOptions={getStateOptions}>
      <div className='page-account-info'>
        <Row type='flex' justify='center'>
          <Steps steps={steps} current={2} />
        </Row>

        <AccountInfoForm />
      </div>
    </Provider>
  </Layout>
);
