import React from 'react';
import SVG from 'react-inlinesvg';

// Why doesn't this work?
// const preProcessor = code => code.replace(/fill=".*?"/g, 'fill="a"');

const TruckIcon = (props) => (
  <SVG
    className='icon-truck'
    src={'https://cdn.shopify.com/s/files/1/0018/4650/9667/files/icon-truck.svg?56160'}
    style={{height: '16px', width: 'auto'}}
    // preProcessor={preProcessor}
    {...props}
  />
);

export default TruckIcon;
