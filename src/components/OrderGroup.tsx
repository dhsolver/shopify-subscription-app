import React, { Component } from 'react';
import {
  Card,
  Col,
  Icon,
  List,
  Row,
} from 'antd';

import Spacer from './common/Spacer';
import Switch from './common/Switch';

const ITEM_COLS = {xs: 12, sm: 8, lg: 6}
  , COL_SHIPPING_DATE = 18
  , GUTTER_ACTIONS = 32;

  // tslint:disable max-line-length
const DUMMY_DATA = Array(8).fill({name: 'Coconut Curry', image: 'https://cdn.shopify.com/s/files/1/0018/4650/9667/products/5D8A9682-2_225ef853-73b2-4c32-8384-6be8ab27dccd.png?v=1563585424'});

class Orders extends Component<{}> {

  private onSkipOrder () {
    return;
  }

  private renderItem (item: any, itemIdx: number) {
    return (
      <Col key={itemIdx} {...ITEM_COLS}>
        <div className='recipe'>
          <img className='recipe-image' src={item.image} alt={item.name} />
          <h4>{item.name}</h4>
        </div>
      </Col>
    );
  }

  public render () {
    return (
      <Card className='order-group'>
        <Row type='flex' justify='space-between'>
          <Col xs={COL_SHIPPING_DATE} className='shipping-date'>
            Shipping on: <span>07/24/2019</span> <a>Modify Schedule</a>
            <div className='last-date'>Last date to ship this modify this order is <span>7/20/2019</span></div>
          </Col>
          <Col xs={6} className='actions'>
            <Row gutter={GUTTER_ACTIONS} type='flex' justify='end'>
              <Col>
                <a><Icon type='edit' /> Edit</a>
              </Col>
              <Col>
                <Switch onChange={this.onSkipOrder} /> Skip
              </Col>
            </Row>
          </Col>
        </Row>

        <Spacer />

        <List
          grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 3}}
          dataSource={DUMMY_DATA}
          renderItem={this.renderItem}
        />
      </Card>
    );
  }
}

export default Orders;
