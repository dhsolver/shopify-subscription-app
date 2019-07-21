import React from 'react';
import { observer } from 'mobx-react';
import { noop } from 'lodash';

import Carousel from './common/Carousel';
import Switch from './common/Switch';

@observer
class Demo extends React.Component <{}> {
  public render () {
    return (
      <div>
        <Carousel />
        <Switch onChange={noop} />
      </div>
    );
  }
}

export default Demo;
