import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import Link from 'next/link';
import Button from '../components/common/Button';
import Spacer from '../components/common/Spacer';
import Layout from '../components/Layout';
import URI from 'urijs';
import Axios from 'axios';
import Router from 'next/router';
import { get } from 'lodash';
import store from 'store';

@autoBindMethods
@observer
export default class Index extends Component <{}> {
  public async componentDidMount () {
    const query = URI.parseQuery(window.location.search) as {user_id?: string}
      , userId = query.user_id
      ;

    if (userId) {
      const { data } = await Axios.get(`/recharge-customers/${userId}`);
      store.set('customerInfo', {id: userId, rechargeId: get(data, 'customers[0].id')});
      Router.push('/dashboard');
    }
    else {
      store.remove('customerInfo');
      Router.push('/onboarding-name');
    }
  }

  public render () {
    return (
      <Layout>
        <Link href='/onboarding-name'>
          <Button type='primary'>Get Started!</Button>
        </Link>
        <Spacer />
        <Link href='/frequency-selection'>
          <a>Quantity/Frequency Selection</a>
        </Link>
        <br/>
        <Link href='/recipe-selection'>
          <a>Recipe Selection</a>
        </Link>
        <br/>
        <Link href='/checkout'>
          <a>Checkout</a>
        </Link>
        <br/>
        <Link href='/dashboard'>
          <a>Dashboard</a>
        </Link>
      </Layout>
    );
  }
}
