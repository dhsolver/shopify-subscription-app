import React from 'react';

import { Row } from 'antd';

import Layout from '../components/Layout';
import Link from 'next/link';
import Button from '../components/common/Button';
import OnboardingNameForm from '../components/OnboardingNameForm';

export default () => (
  <Layout title='Ant Design Page!'>
    <OnboardingNameForm/>
  </Layout>
);
