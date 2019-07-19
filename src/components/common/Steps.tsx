import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { omit } from 'lodash';

import { Steps as AntSteps } from 'antd';
import { StepsProps } from 'antd/es/steps';

const { Step } = AntSteps;

const defaultSteps = [
  {title: 'Finished'},
  {title: 'In Progress'},
  {title: 'Waiting'},
];

interface IProps extends StepsProps {
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
      <AntSteps size='small' current={this.currentStep} onChange={this.onStepChange} {...omit(this.props, 'steps')} >
        {(steps || defaultSteps).map((step, idx) => <Step key={`step-${idx}`} {...step}/>)}
      </AntSteps>
    );
  }
}

export default Steps;
