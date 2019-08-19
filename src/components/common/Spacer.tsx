import React from 'react';
import cx from 'classnames';

interface ISpacerProps {
  className?: string;
  large?: boolean;
  small?: boolean;
}

const Spacer = (props: ISpacerProps) => {
  const classNames = cx(
    'spacer',
    {'spacer-small': props.small},
    {'spacer-large': props.large},
    props.className,
  );
  return <div className={classNames} />;
};

Spacer.displayName = 'Spacer';

export default Spacer;
