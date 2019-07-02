import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

const Index = () => (
  <Layout>
    <p>Sample app using React and Next.js</p>
    <Link href='/antd'>
      <a>Ant Design</a>
    </Link>
  </Layout>
);

export default Index;
