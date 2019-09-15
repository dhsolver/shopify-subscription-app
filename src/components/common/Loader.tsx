import React from 'react';
import { CircleLoader } from 'react-spinners';
import { Spin } from 'antd';

const Loader = (props) => (
  <Spin spinning indicator={<CircleLoader color='#1394C9' />} {...props}>
    {props.children}
  </Spin>
);

export default Loader;
