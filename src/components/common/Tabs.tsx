import React, { Component } from 'react';

import * as Antd from 'antd';

const { TabPane } = Antd.Tabs;

interface IProps {
  tabs: Array<{title: string, route: string, content: any}>;
}

class Tabs extends Component <IProps> {
  public render () {
    return (
      <Antd.Tabs size='large'>
        {this.props.tabs.map((tab, idx) => (
          <TabPane tab={tab.title} key={`tab.title-${idx}`}>
            {tab.content}
          </TabPane>
        ))}
      </Antd.Tabs>
    );
  }
}

export default Tabs;
