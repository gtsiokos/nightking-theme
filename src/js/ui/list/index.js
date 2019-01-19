import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {parse} from 'query-string';
import DropModal from 'reboron/DropModal';
import uuid from 'uuid';

import Pagination from './pagination';
import {
  ErrorList
} from '../../forms';

import modal from '../../../css/modal.css';

class List extends React.Component {

  constructor() {
    super();

    this.state = {
      errors: [],
      totalPages: 1,
      page: 1,
      page_size: 13,
      items_checked: [],
      is_fetched: false,
      has_all_items_checked: false
    };

    this.selectItem           = this.selectItem.bind(this);
    this.deselectItem         = this.deselectItem.bind(this);
    this.updateItem           = this.updateItem.bind(this);
    this.deleteItem           = this.deleteItem.bind(this);

    this.fetchItems           = this.fetchItems.bind(this);
    this.onPageChange         = this.onPageChange.bind(this);

    this.onItemSelectAll      = this.onItemSelectAll.bind(this);

    this.onDeletePrompt       = this.onDeletePrompt.bind(this);
    this.onDeleteConfirm      = this.onDeleteConfirm.bind(this);
    this.onDeleteAbort        = this.onDeleteAbort.bind(this);

    this.onToggle             = this.onToggle.bind(this);
    this.onEnable             = this.onEnable.bind(this);
    this.onDisable            = this.onDisable.bind(this);
  }

  componentWillMount(){
    let query = parse(this.props.location.search);

    this.styles = {modal:modal, theme: this.props.styles};
    this.setState({
      page: parseInt(query.page, 10) || this.state.page,
      page_size: parseInt(query.page_size, 10) || this.state.page_size
    }, () => {
      this.fetchItems();
    });
  }

  fetchItems(){
    if(!this.props.onFetchList) return;

    let queryParams = Object.assign({page:this.state.page, page_size:this.state.page_size}, this.props.queryParams);
    let fetchParams = this.props.fetchParams || [];
    let params = [queryParams].concat(...fetchParams);

    return this.props
      .onFetchList.apply(null, params)
      .then(res => {
        this.setState({
          is_fetched: true,
          totalPages: res.data.totalPages || 1
        });
      })
      .catch(err => {
        let errors = err.data instanceof Object ? [...err.data.errors] : [[err.status, err.statusText].join(' ')];

        this.setState({
          errors: [...this.state.errors].concat(errors)
        });
      });
  }

  selectItem(id){
    if(!id) return;

    let values = this.state.items_checked;

    if(values.includes(id)){
      values = values.filter(v => v != id);
    } else {
      values.push(id);
    }

    this.setState({
      items_checked: values
    }, () => {
      if(!this.props.onSelectListItem) return;

      this.props.onSelectListItem(values);
    });
  }

  deselectItem(id){
    if(!id) return;

    let values = this.state.items_checked;

    values = values.filter(v => v != id);

    this.setState({
      items_checked: values
    }, () => {
      if(!this.props.onSelectListItem) return;

      this.props.onSelectListItem(values);
    });
  }

  updateItem(id, props){
    let item = this.props.items.find(item => item.id == id);

    return this.props
      .onUpdateListItem(Object.assign(item, props))
      .catch(err => {
        let errors = err.data instanceof Object ? [...err.data.errors] : [[err.status, err.statusText].join(' ')];

        this.setState({
          errors: [...this.state.errors].concat(errors)
        });
      });
  }

  deleteItem(id){
    let item = this.props.items.find(item => item.id == id);

    return this.props
      .onDeleteListItem(item)
      .catch(err => {
        let errors = err.data instanceof Object ? [...err.data.errors] : [[err.status, err.statusText].join(' ')];

        this.setState({
          errors: [...this.state.errors].concat(errors)
        });
      });
  }

  onPageChange(page) {
      if (page === this.state.page) return;

      this.setState({
        page: page,
        items_checked: [],
        has_all_items_checked: false
      }, () => {
        this.fetchItems();
      });
  }

  onItemSelect(item, ev){
    let id = item.id;

    if(this.state.has_all_items_checked){
      this.setState({
        has_all_items_checked: false
      }, () => {
        this.deselectItem(id);
      });
    } else {
      this.selectItem(id);
    }
  }

  onItemSelectAll(ev){

    this.setState({
      has_all_items_checked: !this.state.has_all_items_checked
    }, () => {
      this.props.items.forEach(item => {

        if(this.state.has_all_items_checked){
          this.selectItem(item.id);
        } else {
          this.setState({
            items_checked: []
          });
        }

      });
    });
  }

  onDeletePrompt(event) {
    if(!this.state.items_checked.length) return;

    this.setState({
      errors: []
    }, () => {
      this.refs.modal.show();
    });
  }

  onDeleteConfirm(){

    this.setState({
      errors: []
    });

    this.refs.modal.hide();

    let chain = Promise.resolve();
    let ids = [...this.state.items_checked] || [];

    ids.forEach((id, index) => {
      chain = chain.then(() => this.deleteItem(id));
      if(index === ids.length-1){
        chain = chain.then(() => this.fetchItems());
      }
    });
  }

  onDeleteAbort(){
    this.refs.modal.hide();
  }

  onToggle(enabled) {
    if(!this.state.items_checked.length) return;

    this.setState({
      errors: []
    });

    let chain = Promise.resolve();
    let ids = [...this.state.items_checked] || [];

    ids.forEach((id, index) => {
      chain = chain.then(() => this.updateItem(id, {enabled:enabled}));
      if(index === ids.length-1){
        chain = chain.then(() => this.fetchItems());
      }
    });
  }

  onEnable(){
    this.onToggle(true);
  }

  onDisable(){
    this.onToggle(false);
  }

  renderItems(items) {
    if (!items) return null;

    let empty_list_msg = () => this.props.onEmptyListMessage || 'No items are found';

    let render = items => (
      <ul className={this.styles.theme.list}>
        {
          items.map(item => {
            let checked = this.state.items_checked.includes(item.id) || this.state.has_all_items_checked;
            let has_enable = typeof item.enabled != 'undefined';
            let has_edit = this.props.permission.update;
            let has_read = this.props.permission.read;

            let className = [
              checked ? this.styles.theme.itemChecked : this.styles.theme.item,
              item.enabled ? this.styles.theme.itemEnabled : this.styles.theme.itemDisabled
            ].join(' ');

            let icon = has_edit ? 'fa-edit' : 'fa-eye';

            return (
              <li key={item.id} checked={checked} className={className}>
                <div className={this.styles.theme.itemOverlay}></div>
                <div className={this.styles.theme.overview} onClick={has_edit ? this.onItemSelect.bind(this, item) : null}>
                  {
                    has_enable
                    ? <span className={`${this.styles.theme.tag} fa fa-square`}></span>
                    : null
                  }
                  {
                    has_edit || has_read
                    ? <Link to={item.url}>
                        <button className={`btn btn-sm btn-default pull-xs-right`}>
                          <span className={`fa ${icon}`}></span>
                        </button>
                      </Link>
                    : null
                  }
                  {
                    this.props.itemOptions && this.props.itemOptions.length
                    ? this.props.itemOptions.map(option => option(item.id))
                    : null
                  }
                  <span>{item.name}</span>
                </div>
              </li>
            );
          })
        }
      </ul>
    );

    return items.length
      ? <div className='list-group-item'>{render(items)}</div>
      : <div className={this.styles.theme.emptyList}>{empty_list_msg()}</div>;
  }

  render() {
    if(!this.state.is_fetched) return null;

    let has_edit = this.props.permission.update;
    let items = this.props.items;
    let selected_items = this.state.items_checked
      .map(id => items.find(item => item.id === id))
      .filter(item => typeof item != 'undefined')
      .map(item => <li key={item.id}>{item.name}</li>);

    return (
      <div className='row'>
        <div className='row'>
          {
            this.props.options && this.props.options.length
            ? this.props.options.map(option => option())
            : null
          }
          {
            items.length && has_edit && typeof items[0].enabled != 'undefined'
            ? <button className={`btn btn-sm btn-success pull-xs-right`} onClick={this.onEnable}>
                {'Enable'}
              </button>
            : null
          }
          {
            items.length && has_edit && typeof items[0].enabled != 'undefined'
            ? <button className={`btn btn-sm btn-default pull-xs-right`} onClick={this.onDisable}>
                {'Disable'}
              </button>
            : null
          }
          {
            items.length && this.props.permission.delete
            ? <button className={`btn btn-sm btn-danger pull-xs-right`} onClick={this.onDeletePrompt}>
                {'Delete'}
              </button>
            : null
          }
          <input
            type='checkbox'
            className={this.styles.theme.checkbox}
            style={ items.length && has_edit ? {} : {'opacity':'0', 'pointerEvents': 'none'}}
            checked={this.state.has_all_items_checked}
            onChange={has_edit ? this.onItemSelectAll : null} />
          <h4 className={this.styles.theme.header}>{this.props.header}</h4>
        </div>
        <div className='row row-top-13'>
          <ErrorList items={this.state.errors} />
        </div>
        <div className='row row-top-13'>
          {this.renderItems(items)}
        </div>
        <div className='row row-top-26'>
          {
            (this.state.totalPages > 1)
            ? <Pagination styles={this.styles.theme} totalPages={this.state.totalPages} activePage={this.state.page} onPageChange={this.onPageChange} />
            : null
          }
        </div>
        <DropModal ref='modal' className={this.styles.modal.panel}>
          <div className='row'>
            <div className='row'>
              {
                this.props.messageContent && this.props.messageContent.length
                ? this.props.messageContent.map(content => content())
                : null
              }
              {
                this.state.items_checked.length > 1
                ? <p>{`Delete permanently these items?`}</p>
                : <p>{`Delete permanently this item?`}</p>
              }
              <ul style={{'listStyle':'square inside'}}>
                {selected_items}
              </ul>
            </div>
            <div className='row'>
              <div className='btn btn-md btn-danger pull-xs-right' onClick={this.onDeleteConfirm}>Delete</div>
              <div className='btn btn-md btn-regular pull-xs-right' onClick={this.onDeleteAbort}>Cancel</div>
            </div>
          </div>
        </DropModal>
      </div>
    );
  }
}

export default List;