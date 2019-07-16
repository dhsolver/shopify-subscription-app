import React from 'react';
import { Col, message, Row } from 'antd';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import Axios from 'axios';
import Carousel from './common/Carousel';
import Switch from './common/Switch';
import Tabs from './common/Tabs';
import Steps from './common/Steps';
import ItemSelector from './ItemSelector';
import SubscriptionSelector from './SubscriptionSelector';
import dynamic from 'next/dynamic';
const ReferralLink = dynamic(import ('./common/ReferralLink'), { ssr: false });
import { chunk } from 'lodash';
import PersonalInfoForm from './PersonalInfoForm';

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

  private onSwitchChange (checked: boolean) {
   // console.log(`switch to ${checked}`);
  }

  public render () {
    return (
      <div>
        <PersonalInfoForm />

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
          {chunk(this.data, 4).map((rowItems: any, idx: number) => (
              <Row type='flex' justify='space-around' align='top' key={idx}>
                {rowItems.map((rowItem: any) => {
                  const src = rowItem.images.length && rowItem.images[0].src;
                  return (
                    <Col key={src}>
                      <ItemSelector name={rowItem.title} description={rowItem.description} image={src} />
                    </Col>
                  );
                })}
              </Row>
            ))
          }}
        </div>
      </div>
    );
  }
}

export default Demo;
