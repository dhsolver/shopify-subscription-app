import React, { Component } from 'react';
import cx from 'classnames';

import * as Antd from 'antd';

const { TabPane } = Antd.Tabs;

interface IProps {
  centered?: boolean;
  tabs: Array<{title: string, route: string, content: any}>;
}

export const ANT_TABS_PREFIX_CLS = 'ant-tabs';

class Tabs extends Component <IProps> {

  public render () {
    const classNames = cx(
      {[`${ANT_TABS_PREFIX_CLS}-centered`]: this.props.centered},
    );

    return (
      <Antd.Tabs animated={{inkBar: true, tabPane: false}} className={classNames} size='large'>
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
