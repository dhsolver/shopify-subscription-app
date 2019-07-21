import React from 'react';
import Layout from '../components/Layout';
import { Row } from 'antd';
import Tabs from '../components/common/Tabs';
import Account from '../components/Account';
import FreeMeals from '../components/FreeMeals';
import { Provider } from 'mobx-react';

const tabs = [
  { title: 'Orders', route: 'dashboard/orders', content: 'Orders' },
  { title: 'Account', route: 'dashboard/account', content: <Account /> },
  { title: 'Free Meals', route: 'dashboard/free-meals', content: <FreeMeals /> },
];

const getStateOptions = () => [
  {value: 'NJ', name: 'New Jersey'},
  {value: 'NY', name: 'New York'},
];

export default () => (
  <Layout title='Ant Design Page!'>
    <Provider getOptions={getStateOptions}>
      <Row type='flex' justify='center'>
        <Tabs tabs={tabs} />
      </Row>
    </Provider>
  </Layout>
);
