import React from 'react';
import uuid from 'uuid';

import styles from '../../../css/ui/tag.css';

class TagList extends React.Component {
  constructor(){
    super();

    this.state = {
      items_selected: [],
      has_all_items_selected: false
    };

    this.selectItem           = this.selectItem.bind(this);
    this.deselectItem         = this.deselectItem.bind(this);
    this.onItemSelect         = this.onItemSelect.bind(this);
  }

  componentWillMount(){
    let items_selected = React.Children
      .map(this.props.children, child => {
        return child.props.selected ? child.props.id : undefined;
      })
      .filter(id => typeof(id) != 'undefined');

    this.setState({items_selected});
  }

  selectItem(id){
    if(!id) return;

    let values = this.state.items_selected;

    if(values.includes(id)){
      values = values.filter(v => v != id);
    } else {
      values.push(id);
    }
    if(values.length > this.props.max) return;
    if(values.length < this.props.min) return;

    this.setState({
      items_selected: values
    }, () => {
      if(!this.props.onChange) return;

      this.props.onChange(values);
    });
  }

  deselectItem(id){
    if(!id) return;

    let values = this.state.items_selected;

    values = values.filter(v => v != id);

    if(values.length > this.props.max) return;
    if(values.length < this.props.min) return;

    this.setState({
      items_selected: values
    }, () => {
      if(!this.props.onChange) return;

      this.props.onChange(values);
    });
  }

  onItemSelect(id, ev){
    if(this.state.has_all_items_selected){
      this.setState({
        has_all_items_selected: false
      }, () => {
        this.deselectItem(id);
      });
    } else {
      this.selectItem(id);
    }
  }

  render(){
    let props = {
      onItemSelect: this.onItemSelect
    };

    return (
      <div className={styles.list}>
      {
        this.props.children.map(Item => React.cloneElement(Item, {...props}) )
      }
      </div>
    );
  }
}

TagList.defaultProps = {
  min: 1,
  max: 999999
};

export default TagList;