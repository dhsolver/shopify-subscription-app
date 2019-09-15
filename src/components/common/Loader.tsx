import React from 'react';
import { GridLoader } from 'react-spinners';
import { Spin } from 'antd';

const Loader = (props) => (
  <Spin spinning indicator={<GridLoader color='#1394C9' />} {...props}>
    {props.children}
  </Spin>
);

export default Loader;
