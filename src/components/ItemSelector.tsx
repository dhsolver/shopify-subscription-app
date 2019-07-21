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

  public render () {
    const { name, description, image, onChange } = this.props;

    return (
      <div style={{ width: '100px' }}>
        {image
          ? <img src={image} style={{ height: '100px', width: '100px'}} alt={name}/>
          : <div style={{ height: '100px', width: '100px', backgroundColor: 'blue' }} />
        }
        <div style={{ textAlign: 'center' }}>
          <h4>{name}</h4>
          {/*<h5>{description}</h5>*/}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SelectionButtons onChange={onChange} />
        </div>
      </div>
    );
  }
}

export default ItemSelector;
