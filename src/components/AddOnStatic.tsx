import React, { Component } from 'react';
import { noop } from 'lodash';
import { Col, Row } from 'antd';
import SelectionButtons from './SelectionButtons';

class AddOnStatic extends Component<{}> {
  public render () {
    return (
      <div>
        <Row type='flex' justify='center'>
          <h3>Would you like to add mommy and me to this order?</h3>
        </Row>
        <Row>
          <Col span={8}>
            <div style={{backgroundColor: 'white', height: 200}} />
          </Col>
          <Col span={16}>
            <div style={{backgroundColor: '#add8e6', height: 200}}>
              <Row>
                Our Mommy & Me Meals come in a set of 3 8-oz containers that include one of each of the following{' '}
                recipes: Ratatouille, Give it a Chai, Coconut Curry (see ingredients below).
              </Row>
              <Row>
                Special introductory price: $14.99 dollars with your Tiny subscription plan
              </Row>
              <Row>
                <SelectionButtons onChange={noop} />
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddOnStatic;
