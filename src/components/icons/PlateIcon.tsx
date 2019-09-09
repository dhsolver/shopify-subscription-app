import React from 'react';
import SVG from 'react-inlinesvg';

const preProcessor = code => code.replace(/fill=".*?"/g, 'fill="#1394C9"');

const PlateIcon = (props) => (
  <SVG
    className='icon-plate'
    src={'https://cdn.shopify.com/s/files/1/0018/4650/9667/files/icons-plate.svg?40479'}
    style={{height: '1em', width: '1em'}}
    preProcessor={preProcessor}
    {...props}
  />
);

export default PlateIcon;
