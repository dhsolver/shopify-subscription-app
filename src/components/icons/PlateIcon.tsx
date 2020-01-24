import React from 'react';
import SVG from 'react-inlinesvg';

const preProcessor = code => code.replace(/fill=".*?"/g, 'fill="#1394C9"');

const PlateIcon = (props) => (
  <SVG
    className='icon-plate'
    src={'https://cdn.shopify.com/s/files/1/0018/4650/9667/files/icon-plate_2cd4d1ef-55c5-4522-89b3-ca0ae2b6414b.svg?56157'}
    style={{height: '16px', width: 'auto'}}
    preProcessor={preProcessor}
    {...props}
  />
);

export default PlateIcon;
