import React, { Component } from 'react';

import { Tabs as AntTabs } from 'antd';

const { TabPane } = AntTabs;

interface IProps {
  tabs: Array<{title: string, route: string, content: any}>;
}

class Tabs extends Component <IProps> {
  public render () {
    return (
      <AntTabs>
        {this.props.tabs.map((tab, idx) => (
          <TabPane tab={tab.title} key={`tab.title-${idx}`}>
            {tab.content}
          </TabPane>
        ))}
      </AntTabs>
    );
  }
}

export default Tabs;
