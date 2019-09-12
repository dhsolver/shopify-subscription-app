import React from 'react';

import dynamic from 'next/dynamic';
const Layout = dynamic(
  () => import('../components/Layout'),
  { ssr: false },
);
import OnboardingNameForm from '../components/OnboardingNameForm';

export default () => (
  <Layout title='Onboarding - Name'>
    <div className='page-onboarding'>
      <OnboardingNameForm />
    </div>
  </Layout>
);
