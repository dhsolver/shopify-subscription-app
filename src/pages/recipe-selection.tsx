import React from 'react';

import { Row } from 'antd';

import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import RecipeSelectionGroup from '../components/RecipeSelectionGroup';
import Link from 'next/link';
import Button from '../components/common/Button';

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
    <br/>
    <Row type='flex' justify='center'>
      <Link href='/checkout'>
        <Button type='primary' size='large'>Next</Button>
      </Link>
    </Row>
  </Layout>
);
