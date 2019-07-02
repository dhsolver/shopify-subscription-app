import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Demo from '../components/Demo';

export default () => (
  <Layout title='Ant Design Page!'>
    <p>Welcome to next.js!</p>
    <Demo/>
    <Link href='/'>
      <a>index</a>
    </Link>
  </Layout>
);
