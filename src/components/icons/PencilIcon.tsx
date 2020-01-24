import React from 'react';
import SVG from 'react-inlinesvg';

// TODO why doesn't this work?
// const preProcessor = code => code.replace(/fill=".*?"/g, 'fill="#1394C9"');

const PencilIcon = (props) => (
  <SVG
    className='icon-pencil'
    src={'https://cdn.shopify.com/s/files/1/0018/4650/9667/files/icon-pencil_5b12ae69-d7d4-4c28-8b62-b9a43478f3ac.svg?55956'}
    style={{height: '16px', width: 'auto'}}
    // preProcessor={preProcessor}
    {...props}
  />
);

export default PencilIcon;
