import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const Index = () => (
  <Layout>
    <h2>Hello World</h2>
    <Link href='/antd'>
      <a>Ant Design Page</a>
    </Link>
  </Layout>
);

export default Index;
