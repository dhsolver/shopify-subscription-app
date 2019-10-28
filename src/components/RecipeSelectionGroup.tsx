import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Axios from 'axios';
import { get } from 'lodash';
import autoBindMethods from 'class-autobind-decorator';
import { Col, List, Radio, Row, Spin } from 'antd';
import store from 'store';

import ItemSelector from './ItemSelector';
import SmartBool from '@mighty-justice/smart-bool';
import AddOn from './AddOn';
import Spacer from './common/Spacer';
import Link from 'next/link';
import Button from '../components/common/Button';
import { PRODUCT_RECOMMENDATIONS } from '../constants';
import Loader from './common/Loader';

const ITEM_COLS = {xs: 24, sm: 12, lg: 8};

@autoBindMethods
@observer
class RecipeSelectionGroup extends React.Component <{}> {
  @observable private rechargeProductData: any = [];
  @observable private shopifyProductData: any = [];
  @observable public total = 0;
  @observable private isLoading = new SmartBool(true);
  @observable private isRecommended = false;
  private boxItems = {};
  private subscriptionInfo = store.get('subscriptionInfo');
  private maxItems = 12;

  public async componentDidMount () {
    this.maxItems = get(this.subscriptionInfo, 'quantity', 12);
    const [rechargeResponse, shopifyResponse] = await Promise.all([
      Axios.get('/recharge-products/'),
      Axios.get('/shopify-menu-products/'),
    ]);
    this.rechargeProductData = rechargeResponse.data.products;
    this.shopifyProductData = shopifyResponse.data.products;
    this.isLoading.setFalse();
  }

  private onChange (item, value: number) {
    this.total += value;
    if (!this.boxItems[item.id]) {
      this.boxItems[item.id] = {...item, quantity: 0};
    }
    this.boxItems[item.id].quantity += value;
  }

  private onChangeRecommended (event) {
    this.isLoading.setTrue();
    this.isRecommended = event.target.value;
    if (this.isRecommended) { this.total = 0; }
    this.isLoading.setFalse();
  }

  private save () {
    Object.keys(this.boxItems).forEach(id => {
      const item = this.shopifyProductData.find(product => product.id === this.boxItems[id].shopify_product_id);
      this.boxItems[id].variant_id = item.variants[0].id;
    });
    store.set('boxItems', this.boxItems);
  }

  private renderItem (item: any, itemIdx: number) {
    const recommendedQuantity = PRODUCT_RECOMMENDATIONS[item.id]
      ? PRODUCT_RECOMMENDATIONS[item.id].quantity[this.maxItems]
      : 0
      , shopifyProduct = this.shopifyProductData.find(shopifyItem => shopifyItem.id === item.shopify_product_id);

    if (!shopifyProduct) { return <div />; }

    return (
      <Col key={itemIdx} {...ITEM_COLS}>
        <ItemSelector
          description={shopifyProduct.body_html}
          disabled={this.total === this.maxItems}
          name={item.title}
          image={item.images.original}
          isRecommended={this.isRecommended}
          onChange={this.onChange.bind(this, item)}
          quantity={this.isRecommended ? recommendedQuantity : null}
        />
      </Col>
    );
  }

  public render () {
    if (this.isLoading.isTrue) {
      return (
        <Row type='flex' justify='center'>
          <Loader size='large' />
        </Row>
      );
    }

    return (
      <div>
        <Spacer />
        <Row type='flex' justify='center'>
          <h1>Select Recipes</h1>
        </Row>

        <Row type='flex' justify='center'>
          <p>{this.total} / {this.maxItems} selected</p>
        </Row>

        <Spacer />

        <Row type='flex' justify='center'>
          <Radio.Group defaultValue={false} size='large' onChange={this.onChangeRecommended}>
            <Radio.Button value={false}>Build Your Own</Radio.Button>
            <Radio.Button value={true}>Recommended</Radio.Button>
          </Radio.Group>
        </Row>

        <Spacer />

        <List
          grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 3}}
          dataSource={this.rechargeProductData}
          renderItem={this.renderItem}
        />
        <AddOn />
        <br/>
        <Row type='flex' justify='center'>
          <Link href='/account-info'>
            <Button disabled={this.maxItems !== this.total} onClick={this.save} type='primary' size='large'>
              Next
            </Button>
          </Link>
        </Row>
      </div>
    );
  }
}

export default RecipeSelectionGroup;
