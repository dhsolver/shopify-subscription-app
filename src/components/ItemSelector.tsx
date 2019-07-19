import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import autoBindMethods from 'class-autobind-decorator';
import Button from './common/Button';

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

  private onQuantityChange (event: any) {
    this.quantity += Number(event.target.value);
    this.props.onChange(Number(event.target.value));
  }

  private renderButtons () {
    if (this.quantity === 0) {
      return (
        <Button
          value={1}
          style={{borderRadius: '100%'}}
          onClick={this.onQuantityChange}
        >
          +
        </Button>
      );
    }
    return (
      <>
        <Button
          value={-1}
          style={{borderRadius: '100%'}}
          onClick={this.onQuantityChange}
        >
          -
        </Button>
        {this.quantity}
        <Button
          value={1}
          style={{borderRadius: '100%'}}
          onClick={this.onQuantityChange}
        >
          +
        </Button>
      </>
    );
  }

  public render () {
    const { name, description, image } = this.props;

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
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}

export default ItemSelector;
