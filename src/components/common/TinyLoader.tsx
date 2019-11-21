import React from 'react';
import cx from 'classnames';

const LOADER_GIF = 'https://cdn.shopify.com/s/files/1/0018/4650/9667/files/loading-indicator.gif?53033';

interface IProps {
  className?: any;
  children?: any;
  style?: any;
}

const TinyLoader = ({className, children}: IProps) => (
  <div className={cx('tiny-loader', className)}>
    <img className='tiny-loader-img' src={LOADER_GIF} alt='loading...' />
    <div>{children}</div>
  </div>
);

export default TinyLoader;
