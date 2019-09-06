import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { getDay, isAfter, subDays } from 'date-fns';
import Axios from 'axios';
import moment from 'moment';
import autoBindMethods from 'class-autobind-decorator';

import {
  Card,
  Col,
  DatePicker,
  Icon,
  List,
  Row,
  Spin,
} from 'antd';

import { formatDate } from '@mighty-justice/utils';
import SmartBool from '@mighty-justice/smart-bool';

import Spacer from './common/Spacer';
import Switch from './common/Switch';
import { IconButton } from './common/Button';

interface IProps {
  charge: any;
  fetchCharges: () => void;
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
  @observable private isLoading = new SmartBool();
  @observable private isModifyingSchedule = new SmartBool();

  private async onSkipOrder () {
    const { charge, fetchCharges } = this.props
      , lineItems = charge.line_items.map(lineItem => lineItem.subscription_id)
      ;

    this.isLoading.setTrue();
    this.isSkipped.toggle();
    if (this.isSkipped.isTrue) {
      // tslint:disable-next-line
      for (let i = 0; i < lineItems.length; i += 1) {
        await Axios.post(`/skip-charge/${charge.id}/`, {subscription_id: lineItems[i]});
      }
    }
    else if (this.isSkipped.isFalse) {
      // tslint:disable-next-line
      for (let i = 0; i < lineItems.length; i += 1) {
        await Axios.post(`/skip-charge/${charge.id}/`, {subscription_id: lineItems[i]});
      }
    }
    await fetchCharges();
    this.isLoading.setFalse();
  }

  private renderItem (item: any, itemIdx: number) {
    const src = item.images.medium;
    return (
      <Col key={itemIdx} {...ITEM_COLS}>
        <div className='recipe'>
          <img className='recipe-image' src={src} alt={item.title} />
          <h4>{item.title}</h4>
          <p>{item.quantity}</p>
        </div>
      </Col>
    );
  }

  private disabledDate (current) {
    return (current && current < moment().endOf('day')) || getDay(current.toDate()) !== 2;
  }

  private async onDateChange (_current, date) {
    const { charge, fetchCharges } = this.props;
    this.isLoading.setTrue();
    this.isModifyingSchedule.setFalse();
    await Axios.post(`/change-order-date/${charge.id}`, {next_charge_date: date});
    await fetchCharges();
    this.isLoading.setFalse();
  }

  public render () {
    const { charge } = this.props;
    return (
      <Spin spinning={this.isLoading.isTrue}>
        <Card className='order-group'>
          <Row type='flex' justify='space-between'>
            <Col xs={COL_SHIPPING_DATE} className='shipping-date'>
              Shipping on: <span>{formatDate(charge.scheduled_at)}</span>{' '}
              <a onClick={this.isModifyingSchedule.toggle}>Modify Schedule</a>
              {this.isModifyingSchedule.isTrue &&
                <DatePicker
                  open
                  onChange={this.onDateChange}
                  disabledDate={this.disabledDate}
                  defaultPickerValue={moment(new Date(charge.scheduled_at))}
                />
              }
              <div className='last-date'>
                Last date to ship this modify this order is{' '}
                <span>{formatDate(moment(charge.scheduled_at).subtract(4, 'days').toString())}</span>
              </div>
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
            dataSource={charge.line_items}
            renderItem={this.renderItem}
          />
        </Card>
      </Spin>
    );
  }
}

export default Orders;
