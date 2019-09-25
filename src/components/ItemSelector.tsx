import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import cx from 'classnames';
import parser from 'html-react-parser';
import { Card, Popover, Descriptions } from 'antd';
import SelectionButtons from './SelectionButtons';
import { observable } from 'mobx';
import SmartBool from '@mighty-justice/smart-bool';

interface IProps {
  image?: string; // TODO: require this
  name: string;
  description?: string;
  disabled?: boolean;
  isRecommended?: boolean;
  onChange: (quantity: number) => any;
  page?: string;
  quantity?: number;
}

@autoBindMethods
@observer
class ItemSelector extends Component <IProps> {
  private clsPrefix = 'item-selector';
  @observable private isDescriptionVisible = new SmartBool();

  private get showDescription () {
    return !!this.props.description;
  }

  private renderImage () {
    const { description, image } = this.props
      , imageComponent = (
        <div className={`${this.clsPrefix}-image`}>
          {image
            ? <img src={image} alt={name}/>
            : <div className={`${this.clsPrefix}-image-empty`} />
          }
        </div>
      );

    if (!this.showDescription) {
      return imageComponent;
    }

    return (
      <Popover
        content={parser(description)}
        onVisibleChange={this.isDescriptionVisible.set}
        overlayClassName='modal-product-description'
        placement='top'
        trigger='click'
        visible={this.isDescriptionVisible.isTrue}
      >
        {imageComponent}
      </Popover>
    );
  }

  public render () {
    const { name, disabled, onChange, page, quantity, isRecommended } = this.props;

    return (
      <Card className={cx('ant-card-ghost', this.clsPrefix)} bordered={false} hoverable={this.showDescription}>
        {this.renderImage()}
        <div className={`${this.clsPrefix}-info`}>
          <h4>{name}</h4>
        </div>
        <div className={`${this.clsPrefix}-buttons`}>
          <SelectionButtons
            disabled={disabled || name === 'Family Time'}
            onChange={onChange}
            page={page}
            quantity={quantity}
            isRecommended={isRecommended}
          />
        </div>
      </Card>
    );
  }
}

export default ItemSelector;
