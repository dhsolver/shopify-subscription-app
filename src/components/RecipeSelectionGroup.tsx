import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Axios from 'axios';
import { find } from 'lodash';
import autoBindMethods from 'class-autobind-decorator';
import { Col, List, Radio, Row, Spin } from 'antd';
import store from 'store';

import ItemSelector from './ItemSelector';
import SmartBool from '@mighty-justice/smart-bool';
import AddOnStatic from './AddOnStatic';
import Spacer from './common/Spacer';
import Link from 'next/link';
import Button from '../components/common/Button';

const ITEM_COLS = {xs: 24, sm: 12, lg: 8};

@autoBindMethods
@observer
class RecipeSelectionGroup extends React.Component <{}> {
  @observable private data: any = [];
  @observable public total = 0;
  @observable private isLoading = new SmartBool(true);
  private boxItems = {};
  private subscriptionInfo = store.get('subscriptionInfo');
  private maxItems = 12;

  public async componentDidMount () {
    this.maxItems = this.subscriptionInfo.quantity;
    const response = await Axios.get('/collections/with-products/');
    this.data = find(response.data, { handle: 'menu' }).products;
    this.isLoading.setFalse();
  }

  private onChange (id, value: number) {
    this.total += value;
    if (!this.boxItems[id]) {
      this.boxItems[id] = 0;
    }
    this.boxItems[id] += value;
  }

  private save () { store.set('boxItems', this.boxItems); }

  private renderItem (item: any, itemIdx: number) {
    const decodedURL = atob(item.id)
      , splitURL = decodedURL.split('/')
      , id = splitURL[splitURL.length - 1]
      ;

    const src = item.images.length && item.images[0].src;
    return (
      <Col key={itemIdx} {...ITEM_COLS}>
        <ItemSelector
          disabled={this.total === this.maxItems}
          name={item.title}
          description={item.description}
          image={src}
          onChange={this.onChange.bind(this, id)}
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
          <p>{this.total} / {this.maxItems} selected</p>
        </Row>

        <Spacer />

        <Row type='flex' justify='center'>
          <Radio.Group defaultValue='a' size='large'>
            <Radio.Button value='a'>Build Your Own</Radio.Button>
            <Radio.Button value='b'>Recommended</Radio.Button>
          </Radio.Group>
        </Row>

        <Spacer />

        <List
          grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6, xxl: 3}}
          dataSource={this.data}
          renderItem={this.renderItem}
        />
        <AddOnStatic />
        <br/>
        <Row type='flex' justify='center'>
          <Link href='/checkout'>
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
