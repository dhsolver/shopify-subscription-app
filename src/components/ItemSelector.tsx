import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import SelectionButtons from './SelectionButtons';

interface IProps {
  image?: string; // TODO: require this
  name: string;
  description: string;
  onChange: (quantity: number) => any;
}

@autoBindMethods
@observer
class ItemSelector extends Component <IProps> {
  @observable private quantity = 0;
  private clsPrefix = 'item-selector';

  public render () {
    const { name, description, image, onChange } = this.props;

    return (
      <div className={this.clsPrefix}>
        <div className={`${this.clsPrefix}-image`}>
          {image
            ? <img src={image} alt={name}/>
            : <div className={`${this.clsPrefix}-image-empty`} />
          }
        </div>
        <div className={`${this.clsPrefix}-info`}>
          <h4>{name}</h4>
          {/*<h5>{description}</h5>*/}
        </div>
        <div className={`${this.clsPrefix}-buttons`}>
          <SelectionButtons onChange={onChange} />
        </div>
      </div>
    );
  }
}

export default ItemSelector;
