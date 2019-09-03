import React, { Component } from 'react';
import * as Antd from 'antd';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';

interface IProps {
  defaultChecked?: boolean;
  onChange: (checked: boolean) => void;
}

@autoBindMethods
@observer
class Switch extends Component <IProps> {
  public render () {
    return (
      <Antd.Switch {...this.props} />
    );
  }
}

export default Switch;
