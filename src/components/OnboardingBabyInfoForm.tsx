import React, { Component } from 'react';
import { FormCard, OptionSelect, RadioGroup } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { observer, Provider } from 'mobx-react';
import store from 'store';
import Router from 'next/router';
import { observable } from 'mobx';
import { get } from 'lodash';

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

const EATS_MEAT_OPTIONS = [{name: 'Does', value: true}, {name: 'Does not', value: false}];

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

@autoBindMethods
@observer
class OnboardingBabyInfoForm extends Component<{}> {
  @observable private name = '';
  public componentDidMount () {
    this.name = get(JSON.parse(store.get('nameInfo')), 'child_name', '');
    if (!this.name) { Router.push('/onboarding-name'); }
  }

  private onSave (data) {
    store.set('babyInfo', data);
    Router.push('/onboarding-finish');
  }

  public render () {
    const EatsMeatInput = (props) => (
      <span>
        {this.name}{' '}
        <OptionSelect
          {...props}
          showSearch
          fieldConfig={
            {field: 'eats_meat', options: EATS_MEAT_OPTIONS}
          }
        />
        {' '}
        eat meat
      </span>
    );

    const EatingStyleInput = (props) => (
      <span>
        {this.name}'s eating style is{' '}
        <OptionSelect
          {...props}
          showSearch
          fieldConfig={
            {field: 'eating_style', options: EATING_STYLE_OPTIONS}
          }
        />
      </span>
    );

    const insertAllergiesIf = (model: any) => model.has_allergies;

    const babyInfoFieldSet = [
      {
        field: 'birthdate',
        label: `${this.name}'s birthdate is:`,
        type: 'date',
      },
      {
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
        field: 'stage_of_eating',
        label: `What is ${this.name}'s stage of eating?`,
        options: STAGE_OF_EATING_OPTIONS,
        type: 'radio',
      },
      {
        field: 'current_diet',
        label: `What is ${this.name}'s current diet?`,
        options: CURRENT_DIET_OPTIONS,
        type: 'radio',
      },
      {
        editComponent: EatsMeatInput,
        field: 'eats_meat',
        label: '',
        options: EATS_MEAT_OPTIONS,
      },
      {
        editComponent: EatingStyleInput,
        field: 'eating_style',
        label: '',
        options: EATING_STYLE_OPTIONS,
      },
    ];

    return (
      <div>
        <Provider getOptions={getOptions}>
          <FormCard
            onSave={this.onSave}
            title={`About ${this.name}`}
            model={{}}
            fieldSets={[babyInfoFieldSet]}
          />
        </Provider>
      </div>
    );
  }
}

export default OnboardingBabyInfoForm;
