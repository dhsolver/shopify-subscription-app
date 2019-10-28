import React from 'react';
import AccountInfoForm from '../components/AccountInfoForm';
import { stateOptions } from '../constants';
import { Provider } from 'mobx-react';
import Layout from '../components/Layout';

const getStateOptions = () => stateOptions;

const AccountInfoPage = () => (
  <Layout title='Account Info Page'>
    <Provider getOptions={getStateOptions}>
      <div className='page-checkout'>
        <AccountInfoForm />
      </div>
    </Provider>
  </Layout>
);

export default AccountInfoPage;
