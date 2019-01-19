import React from 'react';
import Button from './button';

import styles from '../../../../css/ui/button.css';

class DefaultButton extends Button {
  constructor(){
    super();
  }

  render(){
    let cls = [
      styles.buttonDefault
    ].join(' ');

    return (
      <button className={cls} {...this.props}>
        {this.props.children}
      </button>
    );
  }
}

export default DefaultButton;