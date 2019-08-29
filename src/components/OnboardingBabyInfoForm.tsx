import React, { Component } from 'react';
import { Date, Form, OptionSelect } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { observer, Provider } from 'mobx-react';
import store from 'store';
import Router from 'next/router';
import { observable } from 'mobx';
import { get } from 'lodash';
import SmartBool from '@mighty-justice/smart-bool';
import { sleep } from '../utils/utils';
import cx from 'classnames';
import { Card, Col, Row } from 'antd';

const RELATIONSHIP_OPTIONS = [
  {value: 'parent', name: 'a parent'},
  {value: 'expecting', name: 'expecting'},
  {value: 'caregiver', name: 'a caregiver'},
];

const ALLERGIES_OPTIONS = [{name: 'Yes', value: true}, {name: 'No', value: false}];

const STAGE_OF_EATING_OPTIONS = [
  {name: 'Newborn', value: 'newborn'},
  {name: 'Supported Sitter', value: 'supported_sitter'},
  {name: 'Sitter', value: 'sitter'},
  {name: 'Crawler', value: 'crawler'},
  {name: 'Toddler', value: 'toddler'},
  {name: 'Preschooler', value: 'preschooler'},
];

const CURRENT_DIET_OPTIONS = [
  {name: 'Only breast milk and/or formula', value: 'breast_milk_formula'},
  {name: 'A combination of breast milk and/or formula and purees', value: 'breast_milk_formula__purees'},
  {name: 'Only purees', value: 'purees'},
  {name: 'a combination of purees and finger food', value: 'purees__finger_food'},
  {name: 'Finger foods', value: 'finger_food'},
];

const EATS_MEAT_OPTIONS = [{name: 'Yes', value: true}, {name: 'No', value: false}];

const EATING_STYLE_OPTIONS = [
  {name: 'Picky', value: 'picky'},
  {name: 'Adventurous', value: 'adventurous'},
  {name: 'Both', value: 'both'},
];

const getOptions = () => ({
  allergies: ALLERGIES_OPTIONS,
  current_diet: CURRENT_DIET_OPTIONS,
  eating_style: EATING_STYLE_OPTIONS,
  eats_meat: EATS_MEAT_OPTIONS,
  relationship_to_child: RELATIONSHIP_OPTIONS,
});

const FORM_COLS = {
  lg: {span: 14, offset: 5},
  sm: {span: 18, offset: 3},
  xs: 24,
};

const SUBMIT_SLEEP = 1500;

@autoBindMethods
@observer
class OnboardingBabyInfoForm extends Component<{}> {
  @observable private isSaving = new SmartBool();
  @observable private name = '';

  public componentDidMount () {
    this.name = get(JSON.parse(store.get('nameInfo')), 'child_name', '');
    if (!this.name) { Router.push('/onboarding-name'); }
  }

  private async onSave (data) {
    this.isSaving.setTrue();
    await store.set('babyInfo', data);
    await sleep(SUBMIT_SLEEP);
    await Router.push('/onboarding-finish');
  }

  public render () {
    const InlineDateInput = (props) => (
      <div className='ant-date-inline' style={{width: 300}}>
        <Date
          {...props}
        />
      </div>
    );

    const insertAllergiesIf = (model: any) => model.has_allergies;

    const babyInfoFieldSet = [
      {
        editComponent: InlineDateInput,
        editProps: { className: 'ant-date-inline', size: 'large' },
        field: 'birthdate',
        label: `${this.name}'s birthdate is...`,
        type: 'date',
      },
      {
        editProps: { className: 'ant-radio-group-vertical', size: 'large' },
        field: 'has_allergies',
        label: `Does ${this.name} have any allergies?`,
        options: ALLERGIES_OPTIONS,
        type: 'radio',
      },
      {
        field: 'allergies',
        insertIf: insertAllergiesIf,
        label: `Please list ${this.name}'s allergies below`,
        type: 'text',
      },
      {
        editProps: { className: 'ant-radio-group-vertical', size: 'large' },
        field: 'stage_of_eating',
        label: `What is ${this.name}'s stage of eating?`,
        options: STAGE_OF_EATING_OPTIONS,
        type: 'radio',
      },
      {
        editProps: { className: 'ant-radio-group-vertical', size: 'large' },
        field: 'current_diet',
        label: `${this.name}'s current diet consists of...`,
        options: CURRENT_DIET_OPTIONS,
        type: 'radio',
      },
      {
        editProps: { className: 'ant-radio-group-vertical', size: 'large' },
        field: 'eats_meat',
        label: `Does ${this.name} eat meat?`,
        options: EATS_MEAT_OPTIONS,
        type: 'radio',
      },
      {
        editProps: { className: 'ant-radio-group-vertical', size: 'large' },
        field: 'eating_style',
        label: `${this.name}'s eating style is...`,
        options: EATING_STYLE_OPTIONS,
        type: 'radio',
      },
    ];

    return (
      <div>
        <Provider getOptions={getOptions}>
          <Card className={cx({'ant-card-saving': this.isSaving.isTrue})}>
            <Row>
              <Col {...FORM_COLS}>
                <Form
                  className={cx({'ant-card-saving': this.isSaving.isTrue})}
                  onSave={this.onSave}
                  //title={`About ${this.name}`}
                  model={{}}
                  fieldSets={[babyInfoFieldSet]}
                  saveText='Next'
                />
              </Col>
            </Row>
          </Card>
        </Provider>
      </div>
    );
  }
}

export default OnboardingBabyInfoForm;
