import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import Link from 'next/link';
import Layout from '../components/Layout';

@autoBindMethods
@observer
class Index extends Component <{}> {
  public render () {
    return (
      <Layout>
        <h2>Hello World</h2>
        <Link href='/antd'>
          <a>Ant Design Demo Page</a>
        </Link>
        <Link href='/frequency-selection'>
          <a>Quantity/Frequency Selection</a>
        </Link>
        <Link href='/recipe-selection'>
          <a>Recipe Selection</a>
        </Link>
        <br/>
      </Layout>
    );
  }
}

export default Index;
