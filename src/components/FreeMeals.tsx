import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Avatar, Col, Input, Row } from 'antd';
import Button from '../components/common/Button';
import ReferralLink from './common/ReferralLink';

class FreeMeals extends Component<{}> {
  public render () {
    return (
      <Layout title='Referral Page'>
        <>
          <Row type='flex' justify='center'>
            <h2>Share The Love</h2>
          </Row>

          <Row type='flex' justify='center'>
            <p>Every friend that joins, we'll give you $10</p>
          </Row>

          <Row type='flex' justify='center'>
            <Col>
              <Input placeholder={'Friend\'s Name'}/>
            </Col>
            <Col>
              <Input placeholder={'Friend\'s Email'}/>
            </Col>
          </Row>

          <Row type='flex' justify='center'>
            <Button>Send email</Button>
          </Row>

          <Row type='flex' justify='center'>
            <h3>Your unique referral URL:</h3>
          </Row>

          <Row type='flex' justify='center'>
            <ReferralLink referralLink='https://tinyorganics.com/my-referral-link' />
          </Row>

          <Row type='flex' justify='center'>
            <Col span={6}>
              <Avatar icon='facebook' />
            </Col>
            <Col span={6}>
              <Avatar icon='instagram' />
            </Col>
            <Col span={6}>
              <Avatar icon='twitter' />
            </Col>
            <Col span={6}>
              <Avatar>Pintrest</Avatar>
            </Col>
          </Row>
        </>
      </Layout>
    );
  }
}

export default FreeMeals;
