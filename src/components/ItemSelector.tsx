import React, { Component } from 'react';
import { observer } from 'mobx-react';
import autoBindMethods from 'class-autobind-decorator';
import cx from 'classnames';
import { Card } from 'antd';
import SelectionButtons from './SelectionButtons';

interface IProps {
  image?: string; // TODO: require this
  name: string;
  disabled: boolean;
  onChange: (quantity: number) => any;
  quantity?: number;
}

@autoBindMethods
@observer
class ItemSelector extends Component <IProps> {
  private clsPrefix = 'item-selector';

  public render () {
    const { name, disabled, image, onChange, quantity } = this.props;

    return (
      <Card className={cx('ant-card-ghost', this.clsPrefix)} bordered={false}>
        <div className={`${this.clsPrefix}-image`}>
          {image
            ? <img src={image} alt={name}/>
            : <div className={`${this.clsPrefix}-image-empty`} />
          }
        </div>
        <div className={`${this.clsPrefix}-info`}>
          <h4>{name}</h4>
        </div>
        <div className={`${this.clsPrefix}-buttons`}>
          <SelectionButtons disabled={disabled} onChange={onChange} quantity={quantity} />
        </div>
      </Card>
    );
  }
}

export default ItemSelector;
