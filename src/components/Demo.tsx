import React from 'react';
import { Descriptions, Radio } from 'antd';

class Demo extends React.Component <{}> {
  private state = {
    size: 'default',
  };

  private onChange = (e: any) => {
    const size: 'default' | 'middle' | 'small' = e.target.value;
    this.setState({ size });
  }

  public render () {
    return (
      <div>
        <Radio.Group onChange={this.onChange} value={this.state.size}>
          <Radio value='default'>default</Radio>
          <Radio value='middle'>middle</Radio>
          <Radio value='small'>small</Radio>
        </Radio.Group>
        <br />
        <br />
        <Descriptions bordered title='Custom Size' border size={this.state.size}>
          <Descriptions.Item label='Product'>Cloud Database</Descriptions.Item>
          <Descriptions.Item label='Billing'>Prepaid</Descriptions.Item>
          <Descriptions.Item label='time'>18:00:00</Descriptions.Item>
          <Descriptions.Item label='Amount'>$80.00</Descriptions.Item>
          <Descriptions.Item label='Discount'>$20.00</Descriptions.Item>
          <Descriptions.Item label='Official'>$60.00</Descriptions.Item>
          <Descriptions.Item label='Config Info'>
            Data disk type: MongoDB
            <br />
            Database version: 3.4
            <br />
            Package: dds.mongo.mid
            <br />
            Storage space: 10 GB
            <br />
            Replication_factor:3
            <br />
            Region: East China 1<br />
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }
}

export default Demo;
