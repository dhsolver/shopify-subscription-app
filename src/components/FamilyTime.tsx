import React, { Component } from 'react';
import { Row } from 'antd';

import Center from './common/Center';
import Spacer from './common/Spacer';

class FamilyTime extends Component<{}> {

  public render () {
    return (
      <Row>
        <Spacer />

        <Center>
          <h2>Family Time</h2>
        </Center>

        <Spacer large />
      </Row>
    );
  }
}

export default FamilyTime;
