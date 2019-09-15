import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { getDay } from 'date-fns';
import { find, get, sum } from 'lodash';
import Axios from 'axios';
import moment from 'moment';
import autoBindMethods from 'class-autobind-decorator';

import {
  Card,
  Col,
  DatePicker,
  Icon,
  List, notification,
  Row,
  Spin,
} from 'antd';

import { formatDate } from '@mighty-justice/utils';
import SmartBool from '@mighty-justice/smart-bool';

import Spacer from './common/Spacer';
import Switch from './common/Switch';
import { IconButton } from './common/Button';
import ItemSelector from './ItemSelector';
import PlateIcon from './icons/PlateIcon';
import Loader from './common/Loader';

interface IProps {
  charge: any;
  fetchCharges: () => void;
  hasAddedFamilyTime: boolean;
}

const ITEM_COLS = {xs: 12, sm: 8, lg: 6}
  , COL_SHIPPING_DATE = 14
  , GUTTER_ACTIONS = 32
  , editIcon = () => <Icon type='edit' />
  , submitIcon = () => <Icon type='check' />
  ;

@autoBindMethods
@observer
class OrderGroup extends Component<IProps> {
  // @observable private isSkipped = new SmartBool();
  @observable private isLoading = new SmartBool();
  @observable private isModifyingSchedule = new SmartBool();
  @observable private isEditingOrder = new SmartBool();
  @observable private total = 0;

  private boxItems = {};
  private maxItems = 0;

  public constructor (props) {
    super(props);

    this.maxItems = this.total = sum(props.charge.line_items.map(lineItem => lineItem.quantity));
    props.charge.line_items.forEach(lineItem => {
      const frequency = find(lineItem.properties, {name: 'charge_interval_frequency'});
      this.boxItems[lineItem.subscription_id] = {
        ...lineItem,
        order_interval_frequency: get(frequency, 'value', null),
        order_interval_unit: 'week',
      };
    });
  }

  private onChange (item, value: number) {
    this.isLoading.setTrue();
    this.total += value;
    if (this.boxItems[item.subscription_id] === undefined) {
      this.boxItems[item.subscription_id] = {...item, quantity: 0};
    }
    this.boxItems[item.subscription_id].quantity += value;
    this.isLoading.setFalse();
  }

  private async onSave () {
    const subscriptionIds = Object.keys(this.boxItems);
    this.isLoading.setTrue();

    // tslint:disable-next-line
    for (let i = 0; i < subscriptionIds.length; i += 1) {
      await Axios.put(
        `/subscriptions/${subscriptionIds[i]}`,
        {quantity: this.boxItems[subscriptionIds[i]].quantity},
      );
    }
    await this.props.fetchCharges();
    this.isEditingOrder.setFalse();
    this.isLoading.setFalse();
  }

  // private async onSkipOrder () {
  //   const { charge, fetchCharges } = this.props
  //     , lineItems = charge.line_items.map(lineItem => lineItem.subscription_id)
  //     ;
  //
  //   notification.info({
  //     description: 'figure out a way to make this take WAAAAYYY less time',
  //     message: 'TODO: reconcile with recharge support',
  //   });
  //
  //   this.isLoading.setTrue();
  //   this.isSkipped.toggle();
  //   if (this.isSkipped.isTrue) {
  //     // tslint:disable-next-line
  //     for (let i = 0; i < lineItems.length; i += 1) {
  //       await Axios.post(`/skip-charge/${charge.id}/`, {subscription_id: lineItems[i]});
  //     }
  //   }
  //   else if (this.isSkipped.isFalse) {
  //     // tslint:disable-next-line
  //     for (let i = 0; i < lineItems.length; i += 1) {
  //       await Axios.post(`/skip-charge/${charge.id}/`, {subscription_id: lineItems[i]});
  //     }
  //   }
  //   await fetchCharges();
  //   this.isLoading.setFalse();
  // }

  private renderItem (item: any, itemIdx: number) {
    const src = item.images.medium;
    if (this.isEditingOrder.isTrue) {
      return (
        <List.Item key={itemIdx}>
          <ItemSelector
            disabled={this.total >= this.maxItems}
            name={item.title}
            image={src}
            onChange={this.onChange.bind(this, item)}
            quantity={item.quantity}
          />
        </List.Item>
      );
    }

    return (
      <List.Item key={itemIdx}>
         <div className='recipe'>
          <img className='recipe-image' src={src} alt={item.title} />
          <div className='recipe-info'><h4>{item.title}</h4></div>
          <p>{item.quantity}</p>
        </div>
      </List.Item>
     );
  }

  private renderIconButton () {
    const disabled = this.total !== this.maxItems;
    return (
      <>
        <Col>
          {this.props.hasAddedFamilyTime && <IconButton icon={PlateIcon} textAfter='Family Time' />}
          {this.isEditingOrder.isTrue
            ? <IconButton icon={submitIcon} disabled={disabled} onClick={this.onSave} textAfter='Submit' />
            : <IconButton icon={editIcon} onClick={this.isEditingOrder.setTrue} textAfter='Edit' />
          }
        </Col>
        {/*<Col>*/}
          {/*<Switch onChange={this.onSkipOrder} defaultChecked={false} />{' '}*/}
          {/*{this.isSkipped.isTrue ? 'Skipped' : 'Skip'}*/}
        {/*</Col>*/}
      </>
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
      <Card className='order-group'>
        <Loader spinning={this.isLoading.isTrue}>
          <>
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
              <Col xs={10} className='actions'>
                <Row gutter={GUTTER_ACTIONS} type='flex' justify='end'>
                  {this.renderIconButton()}
                </Row>
              </Col>
            </Row>

            <Spacer />

            <List
              grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 3}}
              dataSource={charge.line_items}
              renderItem={this.renderItem}
            />
          </>
        </Loader>
      </Card>
    );
  }
}

export default OrderGroup;
