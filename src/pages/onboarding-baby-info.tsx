import React from 'react';

import { Row } from 'antd';

import dynamic from 'next/dynamic';
const Layout = dynamic(
  () => import('../components/Layout'),
  { ssr: false },
);
import Link from 'next/link';
import Button from '../components/common/Button';
import OnboardingBabyInfoForm from '../components/OnboardingBabyInfoForm';

export default () => (
  <Layout title='Onboarding - informations'>
    <div className='page-onboarding'>
      <OnboardingBabyInfoForm />
    </div>
  </Layout>
);
