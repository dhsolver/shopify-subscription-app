import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Demo from '../components/Demo';

export default () => (
  <Layout title='Ant Design Page!'>
    <p>Page with typescript and ant design!</p>
    <Demo/>
    <Link href='/'>
      <a>index</a>
    </Link>
  </Layout>
);
