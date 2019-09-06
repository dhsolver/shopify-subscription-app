import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { get } from 'lodash';
import store from 'store';
import Axios from 'axios';

import {
  Button,
  Row,
} from 'antd';

import Center from './common/Center';
import Spacer from './common/Spacer';

import OrderGroup from './OrderGroup';
import Router from 'next/router';

@autoBindMethods
@observer
class Orders extends Component<{}> {
  @observable private charges = [];

  public async componentDidMount () {
    await this.fetchCharges();
  }

  public async fetchCharges () {
    const rechargeId = get(store.get('customerInfo'), 'rechargeId');

    if (!rechargeId) {
      Router.push('/index');
      return;
    }

    const {data} = await Axios.get(`/recharge-queued-charges/?customer_id=${rechargeId}`)
      ;

    this.charges = data.charges;
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

        {this.charges.map(
          charge => <OrderGroup fetchCharges={this.fetchCharges} key={charge.id} charge={charge}/>,
        )}
      </Row>
    );
  }
}

export default Orders;
