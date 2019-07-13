import React from 'react';
import { Card, message } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Axios from 'axios';
import Button from './common/Button';
import Carousel from './common/Carousel';
import Switch from './common/Switch';
import Tabs from './common/Tabs';
import Steps from './common/Steps';
import ItemSelector from './ItemSelector';
import SubscriptionSelector from './SubscriptionSelector';
import dynamic from 'next/dynamic';
const ReferralLink = dynamic(import ('./common/ReferralLink'), { ssr: false });

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

  private onSwitchChange (checked: boolean) {
   // console.log(`switch to ${checked}`);
  }

  public render () {
    return (
      <div>
        <Carousel />

        <Switch onChange={this.onSwitchChange} />

        <Tabs />

        <Steps/>

        <ItemSelector
          name='Coconut Curry'
          description='We love coconut curry'
        />

        <SubscriptionSelector />

        <ReferralLink />

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
