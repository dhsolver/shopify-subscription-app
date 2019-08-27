import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import Link from 'next/link';
import Layout from '../components/Layout';
import Button from '../components/common/Button';

@autoBindMethods
@observer
export default class Index extends Component <{}> {
  public render () {
    return (
      <Layout>
        <Link href='/onboarding-name'>
          <Button>Get Started!</Button>
        </Link>
        <h2>Hello World</h2>
        <br/>
        <Link href='/frequency-selection'>
          <a>Quantity/Frequency Selection</a>
        </Link>
        <br/>
        <Link href='/recipe-selection'>
          <a>Recipe Selection</a>
        </Link>
        <br/>
        <Link href='/checkout'>
          <a>Checkout</a>
        </Link>
        <br/>
        <Link href='/dashboard'>
          <a>Dashboard</a>
        </Link>
      </Layout>
    );
  }
}
