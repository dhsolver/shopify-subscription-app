import React, { Component } from 'react';
import { Col, Icon, Row } from 'antd';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import { FAMILY_TIME_PRICE, FAMILY_TIME_PRODUCT_ID, FAMILY_TIME_VARIANT_ID } from '../constants';
import store from 'store';
import Button from './common/Button';
import PlateIcon from './icons/PlateIcon';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';

const ADD_ON_STATIC_PHOTO = 'https://cdn.shopify.com/s/files/1/0018/4650/9667/files/family-time-banner-image.jpg?40232';
export const FAMILY_TIME_DATA = {
  charge_interval_frequency: null,
  order_interval_frequency: null,
  order_interval_unit: null,
  price: FAMILY_TIME_PRICE,
  product_id: FAMILY_TIME_PRODUCT_ID,
  quantity: 1,
  variant_id: FAMILY_TIME_VARIANT_ID,
};

const COL_PHOTO = {xs: 24, sm: 8}
  , COL_INFO = {xs: 24, sm: 16};

@autoBindMethods
@observer
class AddOn extends Component<{}> {
  @observable private hasAddedFamilyTime = new SmartBool();

  private addFamilyTime () {
    store.set('familyTime', FAMILY_TIME_DATA);
    this.hasAddedFamilyTime.setTrue();
  }

  private onRemoveFamilyTime () {
    store.remove('familyTime');
    this.hasAddedFamilyTime.setFalse();
  }

  private renderFamilyTimeIcon () {
    if (this.hasAddedFamilyTime.isTrue) {
      return (
        <div className='btn-remove'>
          <PlateIcon/>
          <Button type='primary' onClick={this.onRemoveFamilyTime}>
            Yay! <small>adult-sized versions of tiny coming your way!</small>
          </Button>
        </div>
      );
    }

    return (
      <div className='btn-add'>
        <Button type='primary' onClick={this.addFamilyTime} icon='plus' shape='circle'/>
        <Button type='primary' onClick={this.addFamilyTime}>Family Time</Button>
      </div>
    );
  }

  public render () {
    return (
      <div className='add-on-static'>
        <Row type='flex'>
          <Col {...COL_PHOTO} className='col-photo'>
            <div className='photo' style={{backgroundImage: `url(${ADD_ON_STATIC_PHOTO}`}}/>
          </Col>
          <Col {...COL_INFO}>
            <div className='info'>
              <h3>Don’t miss out on Family Time</h3>
              <p>
                Our Mommy & Me Meals come in a set of 3 8-oz containers that include one of each of the following{' '}
                recipes: Ratatouille, Give it a Chai, Coconut Curry (see ingredients below).
              </p>
              <p>
                Special introductory price: $14.99 dollars with your Tiny subscription plan
              </p>
              {this.renderFamilyTimeIcon()}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddOn;
