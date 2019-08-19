import React, { Component } from 'react';
import { Avatar, Col, Input, Row } from 'antd';
import { Form } from '@mighty-justice/fields-ant';
import Button from '../components/common/Button';
import ReferralLink from './common/ReferralLink';
import Center from './common/Center';
import Spacer from './common/Spacer';

const sendFriendFieldSet = {
  fields: [
    { field: 'friend_name', editProps: { placeholder: `Friend's name` }, showLabel: false },
    { field: 'friend_email', editProps: { placeholder: `Friend's email` }, showLabel: false },
  ],
};

class FreeMeals extends Component<{}> {
  public render () {
    return (
      <>
        <Center>
          <Spacer />
          <h2>Share The Love</h2>
          <p>Every friend that joins, we'll give you $10</p>

          <Spacer />

          <Form
            fieldSets={[sendFriendFieldSet]}
            saveText='Send email'
          />

          <Spacer large />

          <h3>Your unique referral URL:</h3>
          <ReferralLink referralLink='https://tinyorganics.com/my-referral-link' />

          <Spacer large />

          <Row type='flex' justify='space-between'>
            <Col span={6}><Avatar icon='facebook' /></Col>
            <Col span={6}><Avatar icon='instagram' /></Col>
            <Col span={6}><Avatar icon='twitter' /></Col>
            <Col span={6}><Avatar>Pintrest</Avatar></Col>
          </Row>

        </Center>
      </>
    );
  }
}

export default FreeMeals;
