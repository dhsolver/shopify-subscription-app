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
  firstCharge: any;
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
  private subscriptionInfo: any = {};

  private boxItems = {};
  private maxItems = 0;

  public constructor (props) {
    super(props);

    this.serializeData();
  }

  private serializeData () {
    const { charge, recipes, firstCharge } = this.props;

    const lineItemData = charge.line_items.map(
      lineItem => {
        const foundItem = recipes.find(
        recipe => String(recipe.shopify_product_id) === String(lineItem.shopify_product_id),
        );

        return {...lineItem, ...(foundItem || {})};
      },
    );
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

  // Add this to processed charge after the holidays
  // <div className='last-date email-confirmation'>
  //   Our orders are delivered on Thursday. If you placed an order before Thursday,
  // your order will arrive the following week.
  //   You will receive an email with tracking information once your order is fulfilled.
  // </div>

  public render () {
    const { charge, recipes, firstCharge } = this.props
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
              { firstCharge.isTrue ? (
                <div>
                  Welcome to the Tiny family!
                </div>
              ) : (
                <div>
                  Your order will arrive on
                  <span> {formatDate(moment(charge.scheduled_at).add(4, 'days').toString())}</span>{' '}
                </div>
              )}
              <div className='last-date email-confirmation'>
                You will receive an email with tracking information once your order is fulfilled.
              </div>
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
