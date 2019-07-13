import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import { Steps as AntSteps } from 'antd';

const { Step } = AntSteps;

@autoBindMethods
@observer
class Steps extends Component <{}> {
  @observable private currentStep = 2;

  private onStepChange (step: number) {
    if (this.currentStep < step) { return; }
    this.currentStep = step;
  }

  public render () {
    return (
      <AntSteps size='small' current={this.currentStep} onChange={this.onStepChange}>
        <Step title='Finished'/>
        <Step title='In Progress'/>
        <Step title='Waiting'/>
      </AntSteps>
    );
  }
}

export default Steps;
