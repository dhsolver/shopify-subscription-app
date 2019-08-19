import React from 'react';
import cx from 'classnames';

// tslint:disable import-blacklist
import { Radio as AntdRadio } from 'antd';
import { RadioGroupProps } from 'antd/lib/radio';

export const QUANTITY_SELECTOR_PREFIX_CLS = 'ant-quantity-selector';

const QuantitySelector = (props: RadioGroupProps) => (
  <AntdRadio.Group {...props} className={cx(QUANTITY_SELECTOR_PREFIX_CLS, props.className)} />
);

QuantitySelector.Button = AntdRadio.Button;

export default QuantitySelector;
