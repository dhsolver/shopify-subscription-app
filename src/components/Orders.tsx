import React, { Component } from 'react';
import { times } from 'lodash';
import {
  Button,
  Row,
} from 'antd';

import Center from './common/Center';
import Spacer from './common/Spacer';

import OrderGroup from './OrderGroup';

class Orders extends Component<{}> {

  public render () {
    return (
      <Row>
        <Spacer />

        <Center>
          <h2>Upcoming Orders</h2>
        </Center>

        <Spacer large />

        <Button type='primary' size='large' icon='plus-circle'>Add<b> Family Time</b></Button>

        <Spacer />

        {times(3, () => <OrderGroup />)}
      </Row>
    );
  }
}

export default Orders;
