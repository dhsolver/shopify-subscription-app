import React from 'react';

import { Row } from 'antd';

import Layout from '../components/Layout';
import Steps from '../components/common/Steps';
import AddOnStatic from '../components/AddOnStatic';
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
    <AddOnStatic />
    <br/>
    <Row type='flex' justify='end'>
      <Link href='/checkout'>
        <Button type='primary'>Next</Button>
      </Link>
    </Row>
  </Layout>
);
