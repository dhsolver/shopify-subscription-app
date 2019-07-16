import React, { HTMLProps } from 'react';
import cx from 'classnames';
import { omit } from 'lodash';

// tslint:disable import-blacklist
import { Button as AntdButton } from 'antd';
import { ButtonProps } from 'antd/lib/button';

const defaultProps = {
  block: false,
  disabled: false,
  ghost: false,
  loading: false,
  size: 'default',
  type: 'default',
};

export const ANT_BTN_PREFIX_CLS = 'ant-btn';

const Button = (props: ButtonProps) => <AntdButton {...props} />;

Button.defaultProps = defaultProps;

Button.Group = AntdButton.Group;

interface IIconProps {
  primary?: boolean;
}

interface IIconButtonProps extends HTMLProps<HTMLAnchorElement> {
  className?: any;
  icon: any;
  iconProps?: IIconProps;
}

export const IconButton = (props: IIconButtonProps) => {
  const className = cx(`${ANT_BTN_PREFIX_CLS}-icon`, props.className);
  return <a {...omit(props, 'icon', 'iconProps')} className={className}><props.icon {...props.iconProps} /></a>;
};

export default Button;
