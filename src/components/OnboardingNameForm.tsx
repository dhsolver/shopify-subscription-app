import React, { Component } from 'react';
import { Form, RadioGroup } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { observable } from 'mobx';
import { observer, Provider } from 'mobx-react';
import { Card, Col, Input, Row } from 'antd';
import store from 'store';
import Router from 'next/router';
import SmartBool from '@mighty-justice/smart-bool';
import { sleep } from '../utils/utils';
import cx from 'classnames';
import { get, isEmpty } from 'lodash';

const RELATIONSHIP_OPTIONS = [
  {value: 'parent', name: 'a parent'},
  {value: 'expecting', name: 'expecting'},
  {value: 'caregiver', name: 'a caregiver'},
];

const getOptions = () => ({
  relationship_to_child: RELATIONSHIP_OPTIONS,
});

const RelationshipRadioGroup = (props) => (
  <div style={{width: 160, margin: '0 auto'}}>
    <div className='title-question'>I am...</div>
    <RadioGroup
      className='ant-radio-group-vertical'
      {...props}
      fieldConfig={
        {editComponent: RelationshipRadioGroup, field: 'relationship_to_child', options: RELATIONSHIP_OPTIONS}
      }
    />
  </div>
);

const ChildNameInput = (props) => (
  <div style={{textAlign: 'center'}}>
    <div className='title-question'>My child's name is...</div>
    <Input {...props} size='large' className='ant-input-inline ant-input-center' />
  </div>
);

const fieldSet = [
  {
    editComponent: RelationshipRadioGroup,
    field: 'relationship_to_child',
    label: '',
    options: RELATIONSHIP_OPTIONS,
    required: true,
  },
  {
    editComponent: ChildNameInput,
    field: 'child_name',
    label: '',
    required: true,
  },
];

const FORM_COLS = {
  lg: {span: 12, offset: 6},
  sm: {span: 16, offset: 4},
  xs: 24,
};

const SUBMIT_SLEEP = 1500;

@autoBindMethods
@observer
class OnboardingNameForm extends Component<{}> {
  @observable private isSaving = new SmartBool();

  public componentDidMount () {
    if (get(store.get('customerInfo'), 'id')) { Router.push('/dashboard'); }
  }

  private async onSave (data: any) {
    this.isSaving.setTrue();
    await store.set('nameInfo', data);
    await sleep(SUBMIT_SLEEP);
    await Router.push('/onboarding-baby-info');
  }

  public render () {
    return (
      <div>
        <Provider getOptions={getOptions}>
          <Card className={cx({'ant-card-saving': this.isSaving.isTrue})}>
            <Row>
              <Col {...FORM_COLS}>
                <Form onSave={this.onSave} model={{}} fieldSets={[fieldSet]} saveText='Next' />
              </Col>
            </Row>
          </Card>
        </Provider>
      </div>
    );
  }
}

export default OnboardingNameForm;
