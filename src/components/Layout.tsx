// tslint:disable no-magic-numbers
import '@babel/polyfill';

import Head from 'next/head';
import enUS from 'antd/lib/locale-provider/en_US';
import Link from 'next/link';

import {
  Col,
  Layout,
  LocaleProvider,
  Row,
} from 'antd';

// Core app styling
import '../assets/styling/layout.less';

const { Content, Footer } = Layout;

interface IProps {
  title?: string;
  children: any;
}

export default ({ title, children }: IProps) => (
  <div style={{background: '#faf6f0', height: '100%', width: '100%'}}>
    <Head>
      {title && <title>{title}</title>}
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
      <link rel='stylesheet' href='https://use.typekit.net/kqf1wnp.css' />
    </Head>
    <style jsx global>{`
      body {
      }
    `}</style>
    <LocaleProvider locale={enUS}>
      <Layout>
        <Content style={{padding: '100px 0 50px'}}>
          <Row type='flex'>
            <Col xs={1} sm={2} lg={3} xl={5} />
            <Col xs={22} sm={20} lg={18} xl={14}>
              {children}
            </Col>
            <Col xs={1} sm={2} lg={3} xl={5} />
          </Row>
        </Content>
        <Footer>
          <Link href='/'><a>Home</a></Link><br />
        </Footer>
      </Layout>
    </LocaleProvider>
  </div>
);
