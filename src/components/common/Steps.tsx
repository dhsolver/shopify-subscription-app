import React, { Component } from 'react';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { omit } from 'lodash';
import Router from 'next/router';

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
  @observable private currentStep = 0;

  public componentDidMount () {
    if (this.props.current) { this.currentStep = this.props.current; }
  }

  private onStepChange (stepNum: number) {
    const { steps } = this.props
      , step = steps[stepNum];

    if (step.url && this.currentStep > stepNum) {
      Router.push(step.url);
    }

    this.currentStep = stepNum;
  }

  private isStepDisabled (step: number) {
    return this.currentStep < step ? true : false;
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
        {(steps || defaultSteps).map((step, idx) => (
          <Antd.Steps.Step key={`step-${idx}`} disabled={this.isStepDisabled(idx)} {...omit(step, 'url')} />
        ))}
      </Antd.Steps>
    );
  }
}

export default Steps;
