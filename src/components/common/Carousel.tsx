import React, { Component } from 'react';
import { Carousel as AntCarousel } from 'antd';
import autoBindMethods from 'class-autobind-decorator';
import { observer } from 'mobx-react';

// interface IProps {
//   images: string[];
// }

@autoBindMethods
@observer
class Carousel extends Component <{}> {
  private onChange (_a: any) {
    // console.log(a);
  }

  public render () {
    return (
      <AntCarousel afterChange={this.onChange}>
        {/*
          #### Outside of demo ####:

          this.props.images.map((image: string) => (
            <div>
              <img src={image.src} alt={image.alt || img.src}>)
            </div>
        */}
        <div>
          <h2>1</h2>
        </div>
        <div>
          <h2>2</h2>
        </div>
        <div>
          <h2>3</h2>
        </div>
        <div>
          <h2>4</h2>
        </div>
      </AntCarousel>
    );
  }
}

export default Carousel;
