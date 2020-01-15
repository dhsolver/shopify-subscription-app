import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import Layout from '../components/Layout';
import URI from 'urijs';
import Axios from 'axios';
import Router from 'next/router';
import { get } from 'lodash';
import store from 'store';

import { Row } from 'antd';
import Loader from '../components/common/Loader';
import { sleep } from '../utils/utils';

@autoBindMethods
@observer
export default class Index extends Component <{}> {
  public async componentDidMount () {
    const query = URI.parseQuery(window.location.search) as {
      user_id?: string,
      utm_source?: string,
      utm_medium?: string,
      utm_name?: string,
      utm_term?: string,
      utm_content?: string,
      gclid?: string,
    }
      , userId = query.user_id
      , utm_source = query.utm_source
      , utm_medium = query.utm_medium
      , utm_name = query.utm_name
      , utm_term = query.utm_term
      , utm_content = query.utm_content
      , gclid = query.gclid
      ;

    if (utm_source) {
      store.set('utmInfo', {
        source: utm_source,
        medium: utm_medium,
        name: utm_name,
        term: utm_term,
        content: utm_content,
      });
    }

    if (gclid) {
      store.set('gclidInfo', gclid);
    }

    if (userId) {
      const { data } = await Axios.get(`/recharge-customers/${userId}`);
      store.set('customerInfo', {id: userId, rechargeId: get(data, 'customers[0].id')});
      Router.push('/dashboard');
    }
    else {
      await sleep();
      store.clearAll();
      Router.push('/onboarding-name');
    }
  }

  public render () {
    return (
      <Layout>
        <Row type='flex' justify='center' align='middle'>
          <Loader />
        </Row>
      </Layout>
    );
  }
}
