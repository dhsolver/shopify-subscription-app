import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { getDay } from 'date-fns';
import { get, sum } from 'lodash';
import Axios from 'axios';
import moment from 'moment';
import autoBindMethods from 'class-autobind-decorator';
import Moment from 'react-moment';
import 'moment-timezone';

import {
  Card,
  Col,
  DatePicker,
  Icon,
  List,
  Row,
} from 'antd';

import { formatDate } from '@mighty-justice/utils';
import SmartBool from '@mighty-justice/smart-bool';

import Spacer from './common/Spacer';
import { IconButton } from './common/Button';
import ItemSelector from './ItemSelector';
import PencilIcon from './icons/PencilIcon';
import PlateIcon from './icons/PlateIcon';
import TruckIcon from './icons/TruckIcon';
import Loader from './common/Loader';

interface IProps {
  charge: any;
  fetchData: () => void;
  hasAddedFamilyTime: boolean;
  recipes: any[];
  subscriptionData: {};
}

const COL_SHIPPING_DATE = 14
  , GUTTER_ACTIONS = 32
  , editIcon = () => <PencilIcon />
  , submitIcon = () => <Icon type='check' />
  ;

@autoBindMethods
@observer
class OrderGroup extends Component<IProps> {
  @observable private isLoading = new SmartBool();
  @observable private isModifyingSchedule = new SmartBool();
  @observable private isEditingOrder = new SmartBool();
  @observable private total = 0;
  @observable private nextChargeScheduledAt: string | number = null;
  @observable private orderIntervalFrequency: any;
  @observable private chargeIntervalFrequency: any;
  @observable private variantId = 0;

  private subscriptionInfo: any = {};
  private boxItems = {};
  private maxItems = 0;

  public constructor (props) {
    super(props);

    this.setSubscriptionDetails();
    this.serializeData();
  }

  public async componentDidMount () {
    await this.setSubscriptionDetails();
  }

  private setSubscriptionDetails () {
    const { subscriptionData } = this.props;

    this.nextChargeScheduledAt = subscriptionData['next_charge_scheduled_at'];
    this.orderIntervalFrequency = subscriptionData['order_interval_frequency'];
    this.chargeIntervalFrequency = subscriptionData['charge_interval_frequency'];

    return;
  }

// TODO: refactor to remove this.fetchSubscriptionInfo
// Is next_charge_date necessary?

  private serializeData () {
    const { charge, recipes } = this.props;

    const lineItemData = charge.line_items.map(
      lineItem => {
        const foundItem = recipes.find(
        recipe => String(recipe.shopify_product_id) === String(lineItem.shopify_product_id),
        );

        return {...lineItem, ...(foundItem || {})};
      },
    );

    this.maxItems = this.total = sum(charge.line_items.map(lineItem => lineItem.quantity));

    if (this.maxItems === 24) {
      this.variantId = 1;
    }

    lineItemData.forEach(lineItem => {
      this.boxItems[lineItem.id] = {
        ...lineItem,
        order_interval_frequency: this.orderIntervalFrequency,
        order_interval_unit: 'week',
      };
      if (!this.subscriptionInfo.chargeIntervalFrequency) {
        this.subscriptionInfo = {
          charge_interval_frequency: this.chargeIntervalFrequency,
          order_interval_frequency: this.orderIntervalFrequency,
          order_interval_unit: 'week',
        };
      }
    });
  }

  private onChange (item, value: number) {
    this.isLoading.setTrue();
    this.total += value;
    if (this.boxItems[item.id] === undefined) {
      this.boxItems[item.id] = {...item, quantity: 0};
    }
    this.boxItems[item.id].quantity += value;
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
          item => String(this.boxItems[subscriptionIds[i]].product_id) === item.shopify_product_id,
        ), 'quantity', 0),
      ];

      if (newQuantity === oldQuantity) {
        // tslint:disable-next-line
        console.log('no change');
      }
      else if (newQuantity && oldQuantity) {
        await Axios.put(
        `/subscriptions/${this.boxItems[subscriptionIds[i]].subscription_id}`,
        {quantity: newQuantity},
        );
      }
      else if ((newQuantity === 0) && oldQuantity) {
        await Axios.delete(`/subscriptions/${this.boxItems[subscriptionIds[i]].subscription_id}`);
      }
      else if (newQuantity && (oldQuantity === 0)) {
        await Axios.post(
          '/subscriptions',
          {
            address_id: charge.address_id,
            next_charge_scheduled_at: charge.scheduled_at,
            product_title: this.boxItems[subscriptionIds[i]].title,
            quantity: newQuantity,
            shopify_variant_id: get(this.boxItems[subscriptionIds[i]], `variants[${this.variantId}].id`),
            ...this.subscriptionInfo,
          },
        );
      }
    }
    await this.props.fetchData();
    this.serializeData();
    this.isEditingOrder.setFalse();
    this.isLoading.setFalse();
  }

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

  private renderEditIcon () {
    const disabled = this.total !== this.maxItems;
    return (
      this.isEditingOrder.isTrue ? (
        <IconButton
          icon={submitIcon}
          disabled={disabled}
          onClick={this.onSave}
          textAfter='Submit'
        />
      ) : (
        <IconButton
          icon={editIcon}
          onClick={this.isEditingOrder.setTrue}
          textAfter='Modify'
        />
      )
    );
  }

  private renderFamilyTimeIcon () {
    return (
      this.props.hasAddedFamilyTime && (
        <IconButton
          icon={PlateIcon}
          textAfter='Family Time'
        />
      )
    );
  }

  private renderTruckIcon () {
    return (
      <IconButton
        icon={TruckIcon}
        onClick={this.isModifyingSchedule.toggle}
        textAfter='Schedule'
      />
    );
  }

  private disabledDate (current) {
    const maxDate = moment().add(3, 'months').toDate();

    // disable dates in the past, days other than Thursday, and dates 3+ months in the future
    return (current && current < moment().endOf('day')) || getDay(current.toDate()) !== 4 || current > maxDate;
  }

  private async onDateChange (_current, date) {
    const { charge, fetchData } = this.props;

    this.isLoading.setTrue();
    const chargeDate = formatDate(moment(date).subtract(4, 'days').toString());
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
      );

    return (
      <Card className='order-group'>
        <Loader spinning={this.isLoading.isTrue}>
          <>
            <Row type='flex' justify='start' className='hide-tablet'>
              <Col span={24}>
                <h3>{moment(charge.scheduled_at).add(4, 'days').format('dddd MMMM Do')}</h3>
              </Col>
            </Row>
            <Row type='flex' justify='start' className='hide-tablet'>
              <span>
                The last day to make changes is{' '}
                {moment(charge.scheduled_at).subtract(1, 'days').format('dddd MMMM Do')}
              </span>
            </Row>
            <Spacer small className='hide-tablet' />
            <Row type='flex' justify='space-between'>
              <Col span={12} className='hide-desktop'>
                <h3>{moment(charge.scheduled_at).add(4, 'days').format('dddd MMMM Do')}</h3>
              </Col>
              <Col>
                {this.renderTruckIcon()}
                {this.isModifyingSchedule.isTrue &&
                  <DatePicker
                    open
                    onChange={this.onDateChange}
                    disabledDate={this.disabledDate}
                    defaultPickerValue={moment(new Date(charge.scheduled_at))}
                  />
                }
              </Col>
              <Col>
                {this.renderEditIcon()}
              </Col>
            </Row>
            <Row type='flex' justify='start' className='hide-desktop'>
              <span>
                The last day to make changes is{' '}
                {moment(charge.scheduled_at).subtract(1, 'days').format('dddd MMMM Do')}
              </span>
            </Row>
            <Spacer small />
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
