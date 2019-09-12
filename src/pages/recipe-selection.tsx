import React, { Component } from 'react';
import store from 'store';

import { Row } from 'antd';

import dynamic from 'next/dynamic';
const Layout = dynamic(
  () => import('../components/Layout'),
  { ssr: false },
);
import Steps from '../components/common/Steps';
import RecipeSelectionGroup from '../components/RecipeSelectionGroup';
import Router from 'next/router';

const steps = [
  {title: 'Plan Details', url: '/frequency-selection'},
  {title: 'Select Recipes', url: '/recipe-selection'},
  {title: 'Checkout', url: '/checkout'},
];

export default class RecipeSelection extends Component<{}> {
  public componentDidMount () {
    if (!store.get('product_id') || !store.get('variant_id')) {
      Router.push('/frequency-selection');
    }
  }

  public render () {
    return (
      <Layout title='Ant Design Page!'>
        <Row type='flex' justify='center'>
          <Steps steps={steps} current={1} />
        </Row>
        <RecipeSelectionGroup />
      </Layout>
    );
  }
}
