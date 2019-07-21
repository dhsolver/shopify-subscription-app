import React, { Component } from 'react';
import { Input, message } from 'antd';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import Button from './Button';

interface IProps {
  referralLink: string;
}

@autoBindMethods
@observer
class ReferralLink extends Component <IProps> {
  private input: any;
  private onCopy (e: any) {
    this.input.select();
    document.execCommand('copy');
    e.target.focus();
    message.success('Copied!');
  }

  public renderCopyButton () {
    if (!document || !document.queryCommandSupported('copy')) { return null; }
    return (
      <Button onClick={this.onCopy}>
        Copy
      </Button>
    );
  }

  public render () {
    const { referralLink } = this.props;

    return (
      <Input addonAfter={this.renderCopyButton()} value={referralLink} ref={(input: any) => this.input = input} />
    );
  }
}

export default ReferralLink;
