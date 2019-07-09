import React from 'react';

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

const Button = (props: ButtonProps) => <AntdButton {...props} />;

Button.defaultProps = defaultProps;

Button.Group = AntdButton.Group;

export default Button;
