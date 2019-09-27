import React from 'react';

// tslint:disable import-blacklist
import { Alert as AntdAlert } from 'antd';
import { AlertProps } from 'antd/lib/alert';

const defaultProps = {
  type: 'info',
};

const Alert = (props: AlertProps) => (
  <AntdAlert {...props} />
);

Alert.defaultProps = defaultProps;

export default Alert;
