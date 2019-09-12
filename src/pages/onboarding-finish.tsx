import React from 'react';

import dynamic from 'next/dynamic';
const Layout = dynamic(
  () => import('../components/Layout'),
  { ssr: false },
);
import OnboardingFinalSteps from '../components/OnboardingFinalSteps';

export default () => (
  <Layout title='Onboarding - photo'>
    <div className='page-onboarding'>
      <OnboardingFinalSteps />
    </div>
  </Layout>
);
