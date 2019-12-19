import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { getDay } from 'date-fns';
import { get, sum } from 'lodash';
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
} from 'antd';

import { formatDate } from '@mighty-justice/utils';
import SmartBool from '@mighty-justice/smart-bool';

import Spacer from './common/Spacer';
import { IconButton } from './common/Button';
import ItemSelector from './ItemSelector';
import PencilIcon from './icons/PencilIcon';
import PlateIcon from './icons/PlateIcon';
import Loader from './common/Loader';

interface IProps {
  charge: any;
  fetchData: () => void;
  hasAddedFamilyTime: boolean;
  recipes: any[];
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
  private subscriptionInfo: any = {};

  private boxItems = {};
  private maxItems = 0;

  public constructor (props) {
    super(props);

    this.serializeData();
  }

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
    lineItemData.forEach(lineItem => {
      this.boxItems[lineItem.id] = {
        ...lineItem,
        order_interval_frequency: get(lineItem, 'subscription_defaults.order_interval_frequency', null),
        order_interval_unit: 'week',
      };
      if (!this.subscriptionInfo.charge_interval_frequency) {
        this.subscriptionInfo = {
          charge_interval_frequency: get(lineItem, 'subscription_defaults.order_interval_frequency', null),
          order_interval_frequency: get(lineItem, 'subscription_defaults.order_interval_frequency', null),
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
      </>
    );
  }

  private disabledDate (current) {
    return (current && current < moment().endOf('day')) || getDay(current.toDate()) !== 4;
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
            <Row type='flex' justify='space-between'>
              <Col xs={COL_SHIPPING_DATE} className='shipping-date'>
                Your order will arrive on
                <span> {formatDate(moment(charge.scheduled_at).add(4, 'days').toString())}</span>{' '}
                <br/>
                The last day to make changes is{' '}
                <span>{formatDate(moment(charge.scheduled_at).subtract(1, 'days').toString())}</span>
                <br/>
                <a onClick={this.isModifyingSchedule.toggle}>Change Delivery Schedule</a>
                  {this.isModifyingSchedule.isTrue &&
                    <DatePicker
                      open
                      onChange={this.onDateChange}
                      disabledDate={this.disabledDate}
                      defaultPickerValue={moment(new Date(charge.scheduled_at))}
                    />
                  }
                  <Spacer small />
                <div className='last-date'>
                    <p>
                      <strong> Holiday Hours: </strong>
                      All orders scheduled for the week of December 25th will be delivered on Friday, December 27th.
                      All orders scheduled for the following week will be delivered on Friday, January 3rd.
                      Happy Holidays from the Tiny team!
                    </p>
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
