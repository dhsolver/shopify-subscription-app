// tslint:disable no-magic-numbers
import '@babel/polyfill';

import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import { debounce } from 'lodash';

import Head from 'next/head';
import enUS from 'antd/lib/locale-provider/en_US';

import * as Antd from 'antd';

// Core app styling
import '../assets/styling/layout.less';

const { Content } = Antd.Layout;

interface IProps {
  title?: string;
  children: any;
}

@autoBindMethods
@observer
export default class Layout extends Component<IProps> {
  private debouncedResizeMessage;
  private resizeObserver;

  public constructor (props) {
    super(props);
  }

  public componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedResizeMessage);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  public componentDidMount () {
    const page = document.getElementById('page');
    this.debouncedResizeMessage = debounce(() => {
      window.top.postMessage(page.scrollHeight, '*');
    }, 250);
    this.resizeObserver = new MutationObserver(this.debouncedResizeMessage);
    this.resizeObserver.observe(page, {attributes: true, childList: true, characterData: true, subtree: true});
    this.resizeObserver.observe(page, {attributes: true, childList: true, characterData: true, subtree: true});
    this.debouncedResizeMessage();
    window.addEventListener('resize', this.debouncedResizeMessage);
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
          <Antd.Layout id='page'>
            <Content style={{padding: '100px 0 50px'}}>
              <Antd.Row type='flex'>
                <Antd.Col xs={1} sm={2} lg={3} xl={5} />
                <Antd.Col xs={22} sm={20} lg={18} xl={14}>
                  {children}
                </Antd.Col>
                <Antd.Col xs={1} sm={2} lg={3} xl={5} />
              </Antd.Row>
            </Content>
          </Antd.Layout>
        </Antd.LocaleProvider>
      </div>
    );
  }
}
