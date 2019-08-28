import React, { Component } from 'react';
import { Form, RadioGroup } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { observer, Provider } from 'mobx-react';
import { Card, Col, Input, Row } from 'antd';
import store from 'store';
import Router from 'next/router';

const RELATIONSHIP_OPTIONS = [
  {value: 'parent', name: 'a parent'},
  {value: 'expecting', name: 'expecting'},
  {value: 'caregiver', name: 'a caregiver'},
];

const ALLERGIES_OPTIONS = [{name: 'Yes', value: true}, {name: 'No', value: false}];

const EATS_MEAT_OPTIONS = [{name: 'Does', value: true}, {name: 'Does not', value: false}];

const EATING_STYLE_OPTIONS = [
  {name: 'Picky', value: 'picky'},
  {name: 'Adventurous', value: 'adventurous'},
  {name: 'Both', value: 'both'},
];

const getOptions = () => ({
  allergies: ALLERGIES_OPTIONS,
  eating_style: EATING_STYLE_OPTIONS,
  eats_meat: EATS_MEAT_OPTIONS,
  relationship_to_child: RELATIONSHIP_OPTIONS,
});

const RelationshipRadioGroup = (props) => (
  <div style={{width: 120, margin: '0 auto'}}>
    <h2>I am...</h2>
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
    <h2>My child's name is...</h2>
    <Input {...props} className='ant-input-inline ant-input-center' />
  </div>
);

const fieldSet = [
  {
    editComponent: RelationshipRadioGroup,
    field: 'relationship_to_child',
    label: '',
    options: RELATIONSHIP_OPTIONS,
  },
  {
    editComponent: ChildNameInput,
    field: 'child_name',
    label: '',
  },
];

const FORM_COLS = {
  lg: {span: 12, offset: 6},
  sm: {span: 16, offset: 4},
  xs: 24,
};

@autoBindMethods
@observer
class OnboardingNameForm extends Component<{}> {

  private onSave (data: any) {
    store.set('nameInfo', JSON.stringify(data));
    Router.push('/onboarding-baby-info');
  }

  public render () {
    return (
      <div>
        <Provider getOptions={getOptions}>
          <Card>
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
