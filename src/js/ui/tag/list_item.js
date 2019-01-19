import React from 'react';
import uuid from 'uuid';

import styles from '../../../css/ui/tag.css';

class TagListItem extends React.Component {
  constructor(){
    super();
  }

  render(){
    let { color, selected } = this.props;
    let style = {
      background: (selected && !!color) ? color : 'auto'
    };

    return (
      <div 
        key={uuid()}
        style={style}
        onClick={() => this.props.onItemSelect(this.props.id)}
        className={selected ? styles.listItemActive : styles.listItem}>
        {this.props.children}
      </div>
    );
  }
}

export default TagListItem;
