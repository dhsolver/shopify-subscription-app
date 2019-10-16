import React from 'react';
import SVG from 'react-inlinesvg';

const preProcessor = code => code.replace(/fill=".*?"/g, 'fill="#1394C9"');

const PencilIcon = (props) => (
  <SVG
    className='icon-pencil'
    src={'https://cdn.shopify.com/s/files/1/0018/4650/9667/files/icons-pencil.svg?49125'}
    style={{height: '1em', width: '1em'}}
    preProcessor={preProcessor}
    {...props}
  />
);

export default PencilIcon;
