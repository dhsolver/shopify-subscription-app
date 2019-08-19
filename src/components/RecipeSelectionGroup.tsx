import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Axios from 'axios';
import { find } from 'lodash';
import autoBindMethods from 'class-autobind-decorator';
import { Col, List, Row, Spin } from 'antd';

import ItemSelector from './ItemSelector';
import SmartBool from '@mighty-justice/smart-bool';
import AddOnStatic from './AddOnStatic';
import Spacer from './common/Spacer';

const ITEM_COLS = {xs: 24, sm: 12, lg: 8};

@autoBindMethods
@observer
class RecipeSelectionGroup extends React.Component <{}> {
  @observable private data: any = [];
  @observable public total = 0;
  @observable private isLoading = new SmartBool(true);

  public async componentDidMount () {
    const response = await Axios.get('/collections/with-products/');

    // *************************************************************
    // testing the recharge and admin API's the following will be removed
    Axios.get('/orders/');
    Axios.get('/recharge-customers/');
    // *************************************************************

    this.data = find(response.data, { handle: 'menu' }).products;
    this.isLoading.setFalse();
  }

  private onChange (value: number) { this.total += value; }

  private renderItem (item: any, itemIdx: number) {
    const src = item.images.length && item.images[0].src;
    return (
      <Col key={itemIdx} {...ITEM_COLS}>
        <ItemSelector
          name={item.title}
          description={item.description}
          image={src}
          onChange={this.onChange}
        />
      </Col>
    );
  }

  public render () {
    if (this.isLoading.isTrue) {
      return (
        <Row type='flex' justify='center'>
          <Spin size='large' />
        </Row>
      );
    }

    return (
      <div>
        <Spacer />
        <Row type='flex' justify='center'>
          <h2>Select Recipes</h2>
        </Row>

        <Row type='flex' justify='center'>
          <p>{this.total} / 12 selected</p>
        </Row>

        <List
          grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 3}}
          dataSource={this.data}
          renderItem={this.renderItem}
        />
        <AddOnStatic />
      </div>
    );
  }
}

export default RecipeSelectionGroup;
