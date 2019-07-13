import React, { Component } from 'react';

import { Tabs as AntTabs, Button } from 'antd';

const { TabPane } = AntTabs;

const operations = <Button>Extra Action</Button>;
class Tabs extends Component <{}> {
  public render () {
    return (
      <AntTabs tabBarExtraContent={operations}>
        <TabPane tab='Tab 1' key='1'>
          Content of tab 1
        </TabPane>
        <TabPane tab='Tab 2' key='2'>
          Content of tab 2
        </TabPane>
        <TabPane tab='Tab 3' key='3'>
          Content of tab 3
        </TabPane>
      </AntTabs>
    );
  }
}

export default Tabs;
