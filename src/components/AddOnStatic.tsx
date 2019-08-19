import React, { Component } from 'react';
import { noop } from 'lodash';
import { Col, Row } from 'antd';
import SelectionButtons from './SelectionButtons';

class AddOnStatic extends Component<{}> {
  public render () {
    return (
      <div className='add-on-static'>
        <Row>
          <Col span={8}>
            <div className='tmp-img' />
            {/*
              <img
                src="/static/organic-toddler-adult-wine-salad-baby-food.jpg"
                alt="organic toddler adult wine salad baby food"
              />
            */}
          </Col>
          <Col span={16}>
            <div className='info'>
              <h3>Don’t miss out on Family Time</h3>
              <p>
                Our Mommy & Me Meals come in a set of 3 8-oz containers that include one of each of the following{' '}
                recipes: Ratatouille, Give it a Chai, Coconut Curry (see ingredients below).
              </p>
              <p>
                Special introductory price: $14.99 dollars with your Tiny subscription plan
              </p>
              <SelectionButtons onChange={noop} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddOnStatic;
