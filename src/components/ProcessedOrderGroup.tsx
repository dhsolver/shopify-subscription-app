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
  recipes: any[];
  fulfillmentInfo: any[];
}

const ITEM_COLS = {xs: 12, sm: 8, lg: 6}
  , COL_SHIPPING_DATE = 14
  , GUTTER_ACTIONS = 32
  ;

@autoBindMethods
@observer
class ProcessedOrderGroup extends Component<IProps> {
  @observable private isLoading = new SmartBool();
  @observable private total = 0;
  @observable private shipmentStatusMessage = null;
  @observable private estimatedDelivery = null;

  private subscriptionInfo: any = {};
  private boxItems = {};
  private maxItems = 0;
  private trackingNumber = null;
  private trackingUrl = null;
  private defaultShippingStatusMessage = 'Yay! Your order is processing!';

  public constructor (props) {
    super(props);

    this.serializeData();
    this.setTrackingInfo();
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
  }

  private async setTrackingInfo () {
    const { fulfillmentInfo } = this.props;

    if (fulfillmentInfo.length > 0) {
      this.trackingNumber = fulfillmentInfo[0].tracking_numbers[0];
      this.trackingUrl = fulfillmentInfo[0].tracking_urls[0];
      await this.seializeShipmentStatus(fulfillmentInfo[0].shipment_status);
    } else {
      this.shipmentStatusMessage = this.defaultShippingStatusMessage;
    }

    this.setEstimatedDeliveryDate();

    return;
  }

  private setEstimatedDeliveryDate () {
    const chargeDate = new Date(this.props.charge.processed_at);
    const dayNum = chargeDate.getDay();
    this.getChargeDayDeliveryDate(dayNum, chargeDate);

    return;
  }

  private async getChargeDayDeliveryDate (dayNum, chargeDate) {
    let numberOfDays;

    switch (dayNum) {
      case 1: {
        numberOfDays = 10;
        break;
      }
      case 2: {
        numberOfDays = 9;
        break;
      }
      case 3: {
        numberOfDays = 8;
        break;
      }
      case 4: {
        numberOfDays = 7;
        break;
      }
      case 5: {
        numberOfDays = 6;
        break;
      }
      case 6: {
        numberOfDays = 5;
        break;
      }
      default: {
        numberOfDays = 4;
      }
    }

    const addDay = await moment(chargeDate).add(numberOfDays, 'd');
    this.estimatedDelivery = moment(addDay).format('dddd MMMM Do');

    return;
  }

  private seializeShipmentStatus (status) {
    let statusMessage;

    switch (status) {
      case 'in_transit': {
        statusMessage = 'Your order is on its way!';
        break;
      }
      case 'delivered': {
        statusMessage = 'Your order has been delivered!';
        break;
      }
      case 'out_for_delivery': {
        statusMessage = 'Your order is out for delivery!';
        break;
      }
      case 'attempted_delivery': {
        statusMessage = 'A delivery attempt was made!';
        break;
      }
      case 'failure': {
        statusMessage = 'Oh no! There was a problem with your order. Please contact hello@tinyorganics.com for more information.';
        break;
      }
      default: {
        statusMessage = this.defaultShippingStatusMessage;
      }
    }

    this.shipmentStatusMessage = statusMessage;
    return;
  }

  private renderItem (data: any, itemIdx: number) {
    const src = data.images.medium || data.images[0].src;

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

  // put back after shopify fulfillment status populates
  // <Col>
  // { this.estimatedDelivery ? (
  //   <>
  //     <p
  //       style={{
  //         verticalAlign: 'middle',
  //         lineHeight: '28px',
  //         color: '#1394C9',
  //       }}
  //     >
  //         {this.shipmentStatusMessage}
  //     </p>
  //   </>
  // ) : (<></>)}
  // </Col>

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
              <Col>
                { this.estimatedDelivery ? (
                  <>
                    <h3
                      style={{lineHeight: '28px'}}
                    >
                      {this.estimatedDelivery}
                    </h3>
                  </>
                ) : (<></>)}
              </Col>
            </Row>
            <Spacer />
            <List
              grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4}}
              dataSource={recipeData.filter(item => item.quantity)}
              renderItem={this.renderItem}
            />
          </>
        </Loader>
      </Card>
    );
  }
}

export default ProcessedOrderGroup;
