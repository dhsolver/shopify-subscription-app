import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import Link from 'next/link';
import Layout from '../components/Layout';
import { FormModal } from '@mighty-justice/fields-ant';
import SmartBool from '@mighty-justice/smart-bool';
import { observable } from 'mobx';
import Button from '../components/common/Button';
import { Col, Row } from 'antd';
import ItemSelector from '../components/ItemSelector';

const fieldSets = [
  {
    fields: [
      {field: 'child_first_name', label: 'First Name'},
      {field: 'child_last_name', label: 'Last Name'},
      {field: 'birthdate', type: 'date'},
    ],
    legend: 'About your little one',
  },
  {
    fields: [
      {field: 'parent_first_name', label: 'First Name'},
      {field: 'parent_last_name', label: 'Last Name'},
      {field: 'phone_number', type: 'phone'},
      {field: 'email'},
    ],
    legend: 'About you',
  },
  {
    fields: [
      {field: 'delivery_date', type: 'datepicker'},
    ],
    legend: 'About your order',
  },
];

@autoBindMethods
@observer
class Index extends Component <{}> {
  @observable private isVisible = new SmartBool();
  @observable private submittedData: any;

  private onSave (data: any) {
    this.submittedData = data;
  }

  public render () {
    return (
      <Layout>
        <h2>Hello World</h2>
        <Link href='/antd'>
          <a>Ant Design Page</a>
        </Link>
        <br/>
        <Button type='primary' onClick={this.isVisible.setTrue}>CLICK ME</Button>
        <FormModal
          cancelText='Nah, man'
          saveText='Alrighty then!'
          fieldSets={fieldSets}
          isVisible={this.isVisible}
          model={{}}
          onSave={this.onSave}
          title={'Let\'s fill out a form'}
        />
        {this.submittedData && Object.keys(this.submittedData).map(key => (
          <p>
            {`${key} => ${this.submittedData[key]}`}
          </p>
        ))}

        <div>
          <Row type='flex' justify='space-around' align='middle'>
            <Col span={4} >
              <ItemSelector name='Apple π Oatmeal' description='short description here'/>
            </Col>
            <Col span={4} >
              <ItemSelector name='Baby Burrito Bowl' description='short description here'/>
            </Col>
            <Col span={4} >
              <ItemSelector name='Bananas Foster' description='short description here'/>
            </Col>
            <Col span={4} >
              <ItemSelector name='Coconut Curry' description='short description here'/>
            </Col>
          </Row>
        </div>
      </Layout>
    );
  }
}

export default Index;
