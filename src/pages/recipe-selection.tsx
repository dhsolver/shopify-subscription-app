import React from 'react';

import { Row } from 'antd';

import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import RecipeSelectionGroup from '../components/RecipeSelectionGroup';

const steps = [
  {title: 'Plan Details'},
  {title: 'Select Recipes'},
  {title: 'Checkout'},
];

export default () => (
  <Layout title='Ant Design Page!'>
    <Row type='flex' justify='center'>
      <Steps steps={steps} current={1} />
    </Row>
    <RecipeSelectionGroup />
  </Layout>
);
