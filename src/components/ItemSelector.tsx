import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import cx from 'classnames';
import { Card } from 'antd';
import SelectionButtons from './SelectionButtons';
import ProductDescriptionModal from './ProductDescriptionModal';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';

interface IProps {
  image?: string; // TODO: require this
  name: string;
  description?: string;
  disabled?: boolean;
  isRecommended?: boolean;
  onChange: (quantity: number) => any;
  quantity?: number;
}

@autoBindMethods
@observer
class ItemSelector extends Component <IProps> {
  private clsPrefix = 'item-selector';
  @observable private isModalVisible = new SmartBool();

  public render () {
    const { name, description, disabled, image, onChange, quantity, isRecommended } = this.props;

    return (
      <Card className={cx('ant-card-ghost', this.clsPrefix)} bordered={false}>
        <a onClick={this.isModalVisible.setTrue}>
          <div className={`${this.clsPrefix}-image`}>
            {image
              ? <img src={image} alt={name}/>
              : <div className={`${this.clsPrefix}-image-empty`} />
            }
          </div>
        </a>
        <div className={`${this.clsPrefix}-info`}>
          <h4>{name}</h4>
        </div>
        <div className={`${this.clsPrefix}-buttons`}>
          <SelectionButtons disabled={disabled} onChange={onChange} quantity={quantity} isRecommended={isRecommended} />
        </div>
        {description && <ProductDescriptionModal isVisible={this.isModalVisible} description={description} />}
      </Card>
    );
  }
}

export default ItemSelector;
