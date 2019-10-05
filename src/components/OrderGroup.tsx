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
  List,
  // notification,
  Row,
  // Spin,
} from 'antd';

import { formatDate } from '@mighty-justice/utils';
import SmartBool from '@mighty-justice/smart-bool';

import Spacer from './common/Spacer';
// import Switch from './common/Switch';
import { IconButton } from './common/Button';
import ItemSelector from './ItemSelector';
import PlateIcon from './icons/PlateIcon';
import Loader from './common/Loader';

interface IProps {
  charge: any;
  fetchData: () => void;
  hasAddedFamilyTime: boolean;
  recipes: any[];
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
  private subscriptionInfo: any = {};

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
      if (!this.subscriptionInfo.charge_interval_frequency) {
        this.subscriptionInfo = {
          charge_interval_frequency: get(frequency, 'value', null),
          order_interval_frequency: get(frequency, 'value', null),
          order_interval_unit: 'week',
        };
      }
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
    const { charge } = this.props;
    const subscriptionIds = Object.keys(this.boxItems);
    this.isLoading.setTrue();

    // tslint:disable-next-line
    for (let i = 0; i < subscriptionIds.length; i += 1) {
      const [newQuantity, oldQuantity] = [
        this.boxItems[subscriptionIds[i]].quantity,
        get(charge.line_items.find(
          item => this.boxItems[subscriptionIds[i]].subscription_id === item.subscription_id,
        ), 'quantity', 0),
      ];

      if (newQuantity === oldQuantity) {
        // tslint:disable-next-line
        console.log('no change');
      }
      else if (newQuantity && oldQuantity) {
        await Axios.put(
        `/subscriptions/${subscriptionIds[i]}`,
        {quantity: newQuantity},
        );
      }
      else if ((newQuantity === 0) && oldQuantity) {
        await Axios.delete(`/subscriptions/${subscriptionIds[i]}`);
      }
      else if (newQuantity && (oldQuantity === 0)) {
        await Axios.post(
          '/subscriptions',
          {
            address_id: charge.address_id,
            next_charge_scheduled_at: charge.scheduled_at,
            price: get(this.boxItems[subscriptionIds[i]], 'variants[0].price'),
            product_title: this.boxItems[subscriptionIds[i]].title,
            quantity: newQuantity,
            shopify_variant_id: get(this.boxItems[subscriptionIds[i]], 'variants[0].id'),
            ...this.subscriptionInfo,
          },
        );
      }
    }
    await this.props.fetchData();
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

  private renderItem (data: any, itemIdx: number) {
    const src = data.images.medium || data.images[0].src;
    if (this.isEditingOrder.isTrue) {
      return (
        <List.Item key={itemIdx}>
          <ItemSelector
            page='orders'
            disabled={this.total >= this.maxItems}
            name={data.title}
            image={src}
            onChange={this.onChange.bind(this, data)}
            quantity={data.quantity || 0}
          />
        </List.Item>
      );
    }

    return (
      <List.Item key={itemIdx}>
         <div className='recipe'>
          <img className='recipe-image' src={src} alt={data.title} />
          <div className='recipe-info'>
            <div className='recipe-count'>{data.quantity || 0}</div>
            <h4>{data.title}</h4>
          </div>
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
    const { charge, fetchData } = this.props;
    this.isLoading.setTrue();
    const chargeDate = formatDate(moment(date).subtract(3, 'days').toString());
    this.isModifyingSchedule.setFalse();
    await Axios.post(`/change-order-date/${charge.id}`, {next_charge_date: chargeDate});
    await fetchData();
    this.isLoading.setFalse();
  }

  public render () {
    const { charge, recipes } = this.props
      , recipeData = recipes.map(
        recipe => {
          const foundItem = charge.line_items.find(
          lineItem => String(recipe.shopify_product_id) === String(lineItem.shopify_product_id),
          );

          return {...recipe, ...(foundItem || {})};
        },
      )
      ;

    return (
      <Card className='order-group'>
        <Loader spinning={this.isLoading.isTrue}>
          <>
            <Row type='flex' justify='space-between'>
              <Col xs={COL_SHIPPING_DATE} className='shipping-date'>
                Shipping on: <span>{formatDate(moment(charge.scheduled_at).add(3, 'days').toString())}</span>{' '}
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
                  The last date to modify this order is{' '}
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
              grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4}}
              dataSource={this.isEditingOrder.isTrue ? recipeData : recipeData.filter(item => item.quantity)}
              renderItem={this.renderItem}
            />
          </>
        </Loader>
      </Card>
    );
  }
}

export default OrderGroup;
