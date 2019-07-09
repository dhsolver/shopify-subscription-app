import React from 'react';
import { Card, Descriptions, message, Radio } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Axios from 'axios';
import Button from './common/Button';

@observer
class Demo extends React.Component <{}> {
  @observable private data: any = [];
  public state = {
    size: 'default',
  };

  public async componentDidMount (): void {
    const response = await Axios.get('/a');
    this.data = response.data;
  }

  private onChange = (e: any) => {
    const size: 'default' | 'middle' | 'small' = e.target.value;
    this.setState({ size });
  }

  private onProductSelect (a: any) {
    message.success(`Success! You\'ve added ${a.currentTarget.value} to your cart!`);
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
        <br />
        <div>
          {this.data.map((datum: any) => (
            <>
              <Card key={datum.id} title={datum.title}>
                <Button type='primary' value={datum.title} onClick={this.onProductSelect}>Add to cart</Button>
                <br/>
                <br/>
                <p >{datum.description}</p>
              </Card>
              <br/>
            </>
          ))}
        </div>
      </div>
    );
  }
}

export default Demo;
