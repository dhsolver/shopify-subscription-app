import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';

import {
  Card,
  Col,
  Icon,
  List,
  Row,
} from 'antd';

import { formatDate } from '@mighty-justice/utils';

import Spacer from './common/Spacer';
import Switch from './common/Switch';
import { IconButton } from './common/Button';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';

interface IProps {
  charge: any;
  products: any[];
}

const ITEM_COLS = {xs: 12, sm: 8, lg: 6}
  , COL_SHIPPING_DATE = 18
  , GUTTER_ACTIONS = 32
  , editIcon = () => <Icon type='edit' />
  ;

@autoBindMethods
@observer
class Orders extends Component<IProps> {
  @observable private isSkipped = new SmartBool();

  private onSkipOrder () {
    this.isSkipped.toggle();
  }

  private renderItem (item: any, itemIdx: number) {
    const src = item.images.length && item.images[0].src;
    return (
      <Col key={itemIdx} {...ITEM_COLS}>
        <div className='recipe'>
          <img className='recipe-image' src={src} alt={item.title} />
          <h4>{item.title}</h4>
        </div>
      </Col>
    );
  }

  public render () {
    return (
      <Card className='order-group'>
        <Row type='flex' justify='space-between'>
          <Col xs={COL_SHIPPING_DATE} className='shipping-date'>
            Shipping on: <span>{formatDate(new Date().toDateString())}</span> <a>Modify Schedule</a>
            <div className='last-date'>Last date to ship this modify this order is <span>7/20/2019</span></div>
          </Col>
          <Col xs={6} className='actions'>
            <Row gutter={GUTTER_ACTIONS} type='flex' justify='end'>
              <Col>
                <a><IconButton icon={editIcon} /> Edit</a>
              </Col>
              <Col>
                <Switch onChange={this.onSkipOrder} defaultChecked={false} />{' '}
                {this.isSkipped.isTrue ? 'Skipped' : 'Skip'}
              </Col>
            </Row>
          </Col>
        </Row>

        <Spacer />

        <List
          grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 3}}
          dataSource={this.props.products}
          renderItem={this.renderItem}
        />
      </Card>
    );
  }
}

export default Orders;
