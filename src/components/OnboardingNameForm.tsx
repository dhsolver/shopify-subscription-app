import React, { Component } from 'react';
import { FormCard, OptionSelect } from '@mighty-justice/fields-ant';
import autoBindMethods from 'class-autobind-decorator';
import { observer, Provider } from 'mobx-react';
import { Input } from 'antd';
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

const RelationshipOptionSelect = (props) => (
  <div>
    I am{' '}
    <OptionSelect
      {...props}
      showSearch
      fieldConfig={
        {editComponent: RelationshipOptionSelect, field: 'relationship_to_child', options: RELATIONSHIP_OPTIONS}
      }
    />
  </div>
);

const ChildNameInput = (props) => (
  <div>My child's name is <Input {...props}/></div>
);

const fieldSet = [
  {
    editComponent: RelationshipOptionSelect,
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
          <FormCard onSave={this.onSave} model={{}} fieldSets={[fieldSet]} saveText='Next'/>
        </Provider>
      </div>
    );
  }
}

export default OnboardingNameForm;
