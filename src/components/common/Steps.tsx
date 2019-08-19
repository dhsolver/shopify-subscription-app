import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { omit } from 'lodash';

import * as Antd from 'antd';

const defaultSteps = [
  {title: 'Finished'},
  {title: 'In Progress'},
  {title: 'Waiting'},
];

interface IProps {
  current?: number;
  steps?: Array<{[key: string]: any}>;
}

@autoBindMethods
@observer
class Steps extends Component <IProps> {
  @observable private currentStep = 2;

  private onStepChange (step: number) {
    if (this.currentStep < step) { return; }
    this.currentStep = step;
  }

  public render () {
    const { steps } = this.props;
    return (
      <Antd.Steps
        current={this.currentStep}
        labelPlacement='vertical'
        onChange={this.onStepChange}
        style={{maxWidth: 600}}
        {...omit(this.props, 'steps')}
      >
        {(steps || defaultSteps).map((step, idx) => <Antd.Steps.Step key={`step-${idx}`} {...step}/>)}
      </Antd.Steps>
    );
  }
}

export default Steps;
