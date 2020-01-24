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
  trackingURL: any;
  fedExInfo: any;
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
  @observable private deliveryStatusMessage = null;
  @observable private estimatedDeliveryDate = null;
  @observable private deliveryStatusLink = null;
  @observable private chargeDate = null;

  private subscriptionInfo: any = {};
  private boxItems = {};
  private maxItems = 0;

  public constructor (props) {
    super(props);

    this.serializeData();
  }

  public componentDidMount () {
    this.setTrackingDetails();
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

  private setTrackingDetails () {
    const { fedExInfo, trackingURL } = this.props;
    this.chargeDate = this.props.charge.processed_at;

    if (!!fedExInfo) {
      this.parsetrackingInfoCode(
        fedExInfo.status_code,
        fedExInfo.estimated_delivery_date || fedExInfo.actual_delivery_date,
      );
    } else {
      this.deliveryStatusMessage = 'Your order is processing!';
      this.estimatedDeliveryNoTracking();
    }

    this.deliveryStatusLink = trackingURL;

    return;
  }

  // if no tracking number, set expected delivery based on charge day
  private estimatedDeliveryNoTracking () {
    const chargeDate = new Date(this.props.charge.processed_at);
    const dayNum = chargeDate.getDay();
    this.getChargeDayDeliveryDate(dayNum);

    return;
  }

  private async getChargeDayDeliveryDate (dayNum) {
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

    const addDay = await moment(this.chargeDate).add(numberOfDays, 'd');
    this.setEstimatdDelivery(addDay);

    return;
  }

  private setEstimatdDelivery (date) {
    this.estimatedDeliveryDate = moment(date).format('dddd MMMM Do');
  }

  private parsetrackingInfoCode (statusCode, deliveryDate) {
    let statusMessage;

    switch (statusCode) {
      case 'IT': {
        statusMessage = 'Your order is on its way!';
        this.setEstimatdDelivery(deliveryDate);
        break;
      }
      case 'DE': {
        statusMessage = 'Your order has been delivered!';
        this.setEstimatdDelivery(deliveryDate);
        break;
      }
      case 'EX': {
        statusMessage = 'Oh no! There was a problem with your order. Please contact hello@tinyorganics.com for more information.';
        break;
      }
      default: {
        statusMessage = 'Your order is processing!';
      }
    }

    this.deliveryStatusMessage = statusMessage;
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

// TODO verify day of the week
    return (
      <Card className='order-group'>
        <Loader spinning={this.isLoading.isTrue}>
          <>
            <Row type='flex' justify='space-between'>
              <Col>
                { this.estimatedDeliveryDate ? (
                  <>
                    <h3
                      style={{lineHeight: '28px'}}
                    >
                      {this.estimatedDeliveryDate}
                    </h3>
                  </>
                ) : (<></>)}
              </Col>
              <Col>
                <p
                  style={{
                    verticalAlign: 'middle',
                    lineHeight: '28px',
                    color: '#1394C9',
                  }}
                >
                    {this.deliveryStatusMessage}
                </p>
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
