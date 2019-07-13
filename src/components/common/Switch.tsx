import React, { Component } from 'react';
import { Switch as AntSwitch } from 'antd';
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
    const { defaultChecked, onChange } = this.props;
    return (
      <AntSwitch
        defaultChecked={defaultChecked || true}
        onChange={onChange}
      />
    );
  }
}

export default Switch;
