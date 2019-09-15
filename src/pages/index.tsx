import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import Layout from '../components/Layout';
import URI from 'urijs';
import Axios from 'axios';
import Router from 'next/router';
import { get } from 'lodash';
import store from 'store';
import { CircleLoader } from 'react-spinners';

import { Col, Row, Spin } from 'antd';

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
        <Row type='flex' justify='center' align='middle'>
          <Spin spinning indicator={<CircleLoader color='#1394C9' />} />
        </Row>
      </Layout>
    );
  }
}
