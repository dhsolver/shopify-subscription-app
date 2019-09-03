import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { find, times } from 'lodash';
import store from 'store';
import Axios from 'axios';

import {
  Button,
  Row,
} from 'antd';

import Center from './common/Center';
import Spacer from './common/Spacer';

import OrderGroup from './OrderGroup';

@autoBindMethods
@observer
class Orders extends Component<{}> {
  @observable private products = [];
  @observable private charges = [];

  public async componentDidMount () {
    const { id, rechargeId } = store.get('customerInfo')
      , [charges, products] = await Promise.all([
        Axios.get(`/recharge-queued-charges/?customer_id=${rechargeId}`),
        Axios.get('/collections/with-products/'),
      ])
      ;

    this.charges = charges.data.charges;
    this.products = find(products.data, { handle: 'menu' }).products;
  }

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

        {this.charges.map(charge => <OrderGroup key={charge.id} charge={charge} products={this.products} />)}
      </Row>
    );
  }
}

export default Orders;
