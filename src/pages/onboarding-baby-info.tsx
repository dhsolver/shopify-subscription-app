import React from 'react';

import Layout from '../components/Layout';
import OnboardingBabyInfoForm from '../components/OnboardingBabyInfoForm';

import Steps from '../components/common/Steps';
import { Row } from 'antd';

const steps = [
  {title: 'Me & My Kids', url: '/onboarding-name'},
  {title: 'My Plan', url: '/frequency-selection'},
  {title: 'Checkout', url: '/checkout'},
];

export default () => (
  <Layout title='Onboarding - informations'>
    <Row type='flex' justify='center'>
      <Steps steps={steps} current={0} />
    </Row>
    <div className='page-onboarding'>
      <OnboardingBabyInfoForm />
    </div>
  </Layout>
);
