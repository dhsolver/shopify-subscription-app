import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import Link from 'next/link';
import Layout from '../components/Layout';
import Button from '../components/common/Button';
import Spacer from '../components/common/Spacer';

@autoBindMethods
@observer
export default class Index extends Component <{}> {
  public render () {
    return (
      <Layout>
        <Link href='/onboarding-name'>
          <Button type='primary'>Get Started!</Button>
        </Link>
        <Spacer />
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
