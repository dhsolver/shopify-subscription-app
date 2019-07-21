import React from 'react';
import Layout from '../components/Layout';
import { Row } from 'antd';
import Tabs from '../components/common/Tabs';
import Account from '../components/Account';
import FreeMeals from '../components/FreeMeals';

const tabs = [
  { title: 'Orders', route: 'dashboard/orders', content: 'Orders' },
  { title: 'Account', route: 'dashboard/account', content: <Account /> },
  { title: 'Free Meals', route: 'dashboard/free-meals', content: <FreeMeals /> },
];

export default () => (
  <Layout title='Ant Design Page!'>
    <Row type='flex' justify='center'>
      <Tabs tabs={tabs} />
    </Row>
  </Layout>
);
