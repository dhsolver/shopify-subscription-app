import React from 'react';
import { Upload as AntUpload, Button, Icon } from 'antd';


const Upload = (a) => {
  return (
    <AntUpload {...props}>

      {a.children}
      {/*<Button>*/}
        {/*<Icon type="upload" /> Click to Upload*/}
      {/*</Button>*/}
    </AntUpload>
  );
};

export default Upload;
