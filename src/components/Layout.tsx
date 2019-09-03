// tslint:disable no-magic-numbers
import '@babel/polyfill';

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import URI from 'urijs';
import store from 'store';

import Head from 'next/head';
import enUS from 'antd/lib/locale-provider/en_US';
import Link from 'next/link';

import * as Antd from 'antd';

// Core app styling
import '../assets/styling/layout.less';
import Router from 'next/router';

const { Content, Footer } = Antd.Layout;

interface IProps {
  title?: string;
  children: any;
}

@autoBindMethods
@observer
export default class Layout extends Component<IProps> {
  public componentDidMount () {
    const query = URI.parseQuery(window.location.search) as {user_id?: string}
      , queryUserID = query.user_id
      , storedUserInfo = store.get('customerInfo')
      , userId = queryUserID || storedUserInfo.id
      ;
    if (userId) {
      store.set('customerInfo', {id: userId, rechargeId: storedUserInfo.rechargeId});
      Router.push('/dashboard');
    }
  }

  public render () {
    const { title, children } = this.props;

    return (
      <div style={{background: '#faf6f0', height: '100%', width: '100%'}}>
        <Head>
          {title && <title>{title}</title>}
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charSet='utf-8' />
          <link rel='stylesheet' href='https://use.typekit.net/kqf1wnp.css' />
          <script src='https://js.stripe.com/v3/' />
        </Head>
        <Antd.LocaleProvider locale={enUS}>
          <Antd.Layout>
            <Content style={{padding: '100px 0 50px'}}>
              <Antd.Row type='flex'>
                <Antd.Col xs={1} sm={2} lg={3} xl={5} />
                <Antd.Col xs={22} sm={20} lg={18} xl={14}>
                  {children}
                </Antd.Col>
                <Antd.Col xs={1} sm={2} lg={3} xl={5} />
              </Antd.Row>
            </Content>
            <Footer>
              <Link href='/'><a>Home</a></Link><br />
            </Footer>
          </Antd.Layout>
        </Antd.LocaleProvider>
      </div>
    );
  }
}
