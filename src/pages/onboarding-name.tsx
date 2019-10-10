import React from 'react';

import Layout from '../components/Layout';
import OnboardingNameForm from '../components/OnboardingNameForm';

import Steps from '../components/common/Steps';
import { Row } from 'antd';

const steps = [
  {title: 'Me & My Kids', url: '/onboarding-name'},
  {title: 'My Plan', url: '/frequency-selection'},
  // {title: 'First Box', url: '/recipe-selection'},
  {title: 'Checkout', url: '/checkout'},
];

export default () => (
  <Layout title='Onboarding - Name'>
    <Row type='flex' justify='center'>
      <Steps steps={steps} current={0} />
    </Row>
    <div className='page-onboarding'>
      <OnboardingNameForm />
    </div>
  </Layout>
);
