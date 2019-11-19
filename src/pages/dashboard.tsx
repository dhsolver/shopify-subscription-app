import React from 'react';
import { Provider } from 'mobx-react';

import Layout from '../components/Layout';
import Tabs from '../components/common/Tabs';
import Account from '../components/Account';
import Orders from '../components/Orders';
import { stateOptions } from '../constants';
// import FamilyTime from '../components/FamilyTime';
// import FreeMeals from '../components/FreeMeals';

const tabs = [
  { title: 'Orders', route: 'dashboard/orders', content: <Orders /> },
  { title: 'Account', route: 'dashboard/account', content: <Account /> },

  // SAVE FOR V2
  //
  // { title: 'Free Meals', route: 'dashboard/free-meals', content: <FreeMeals /> },
  // { title: 'Family Time', route: 'dashboard/family-time', content: <FamilyTime /> },
];

const getStateOptions = () => stateOptions;

export default () => (
  <Layout title='Tiny Organics User Dashboard'>
    <Provider getOptions={getStateOptions}>
      <Tabs centered tabs={tabs} />
    </Provider>
  </Layout>
);
