import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { FormModal } from '@mighty-justice/fields-ant';
import SmartBool from '@mighty-justice/smart-bool';
import { observable } from 'mobx';
import Button from '../components/common/Button';

const fieldSets = [
  {
    fields: [
      {field: 'response_plum_gold'},
      {field: 'innovate_adp_implementation'},
      {field: 'principal_overriding_synergies'},
    ],
    legend: 'One',
  },
  {
    fields: [
      {field: 'blue_pants_dynamic'},
      {field: 'program_dynamic_checking_account'},
      {field: 'backing_up_enable_dynamic'},
    ],
    legend: 'Two',
  },
  {
    fields: [
      {field: 'copy_invoice_crossplatform'},
      {field: 'orchestrate_frictionless_bleedingedge'},
      {field: 'cambridgeshire_norway_metal'}],
    legend: 'Three',
  },
];

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
          title='Set Law Firm Contact'
        />
        {this.submittedData && Object.keys(this.submittedData).map(key => (
          <p>
            {`${key} => ${this.submittedData[key]}`}
          </p>
        ))}
      </Layout>
    );
  }
}

export default Index;
