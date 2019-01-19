import React from 'react';
import Infinite from 'react-infinite';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import chunk from 'lodash/chunk';

import uuid from 'uuid';
import moment from 'moment';
import '../utils/moment-purge-timezone';

import {
  DefaultSmallButton,
  PrimarySmallButton,
  SuccessSmallButton,
  WarningSmallButton,
  DangerSmallButton
} from '../ui/button/small';

import {
  AlertRuntimeError,
  AlertApiService
} from '../ui/alerts';

import { get_event_list } from '../actions/events';
import { login_required, error_catched_by } from '../utils/decorators';

import EventListItem from './list_item';

import styles from '../../css/events.css';

//@login_required
//@error_catched_by(AlertRuntimeError, AlertApiService)
class EventList extends React.Component {

  constructor(){
    super();

    this.state = {
      is_fetching: false,
      items_selected: [],
      list_width: 0,
      list_height: 0,
      list_item_height: 0,
      has_all_items_selected: false
    };

    this.setStateAsync = (state) => {
      return new Promise((resolve, reject) => {
        this.setState(state, () => {
          resolve(this.state);
        })
      });
    };

    this.updateListDimensions = debounce(this.updateListDimensions, 500).bind(this);
    window.addEventListener('resize', this.updateListDimensions);

    [
      'selectItem',
      'deselectItem',
      'onItemSelect',
      'getEvents',
      'renderEvent',
      'renderEvents'
    ].forEach(func => this[func] = this[func].bind(this));
  }

  componentWillMount() {
    this.getEvents();
  }

  componentDidMount(){
    this.updateListDimensions();
  }

  componentWillReceiveProps(props){
    if(props.apply_filters && !this.state.is_fetching){
      Promise
        .resolve()
        .then(() => this.setStateAsync({is_fetching:true, items_selected:[]}))
        .then(() => this.getEvents())
        .then(() => this.setStateAsync({is_fetching:false}));
    }
  }

  updateListDimensions(){
    if(!Object.keys(this.refs).length) return;

    this.setState({
      list_width: this.refs.eventList.clientWidth,
      list_height: this.refs.eventList.clientHeight,
      list_item_height: this.refs.eventListItem.clientHeight
    });
  }

  selectItem(id){
    if(!id) return;

    let values = this.state.items_selected;

    if(values.includes(id)){
      values = values.filter(v => v != id);
    } else {
      values.push(id);
    }

    this.setState({
      items_selected: values
    }, () => {
      //this.list.forceUpdateGrid();
    });
  }

  deselectItem(id){
    if(!id) return;

    let values = this.state.items_selected;

    values = values.filter(v => v != id);

    this.setState({
      items_selected: values
    }, () => {
      //this.list.forceUpdateGrid();
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

  getEvents(params = {}){
    let filters = this.props.filters;

    if(!filters.status) return;
    if(!filters.feed) return;
    if(!filters.date) return;

    let query = {
      date: moment(filters.date).format('YYYY-MM-DD'),
      status: filters.status,
      feed: filters.feed,
      _page: 1,
      _limit: 40
    }

    return Promise
      .resolve()
      .then(() => this.props.get_event_list({...query, ...params}));
  }

  renderEvent(event) {
    let feed = this.props.feeds.find(_ => _.id == event.feed);
    let status = this.props.status.find(_ => _.id == event.status);
    let tags = this.props.tags.filter(_ => event.tags.includes(_.id));

    let cls = this.state.items_selected.includes(event.id)
      ? styles.listItemActive
      : styles.listItem;

    let icon_style = {
      color: feed.color,
      marginRight: '11rem'
    };

    return (
      <div key={event.id} className={cls} onClick={() => this.onItemSelect(event.id)}>
        <span>
          <span className={'fa fa-circle'} style={icon_style} />
          <span className={styles.timeBadge}>
            <span className={'fa fa-clock-o'} />
            {moment(event.start_time).format('HH:mm')}
          </span>
        </span>
        <span>
        {
          tags.map((tag, index) => {
            return (
              <span key={index} className={styles.tagBadge} data-status={tag.id}>
                <span className={'fa fa-tag'} />
                {tag.name}
              </span>      
            );
          })
        }
        </span>
      </div>
    );
  }

  renderEvents(events) {
    if(!this.props.events.length) return null;

    return (
      <React.Fragment>
      {
        this.state.list_height
        ? <Infinite 
            containerHeight={this.state.list_height} 
            //containerHeight={50} 
            elementHeight={this.state.list_item_height}
            isInfiniteLoading={false}
            infiniteLoadBeginEdgeOffset={this.state.list_item_height*10}
            onInfiniteLoad={() => {
              if(!this.props.next_page) return;
              if(this.state.is_fetching) return;

              return Promise
                .resolve()
                .then(() => this.setStateAsync({is_fetching: true}))
                .then(() => this.getEvents({_page:this.props.next_page, _limit:20}))
                .then(() => this.setStateAsync({is_fetching: false}));
            }}>
            { events.map(event => this.renderEvent(event)) }
          </Infinite>
        : null
      }
      </React.Fragment>
    );
  }

  render(){
    let events = this.props.events;
    let events_selected = this.state.items_selected;

    let offset_style = {
      position: 'absolute',
      left: '-9000rem'
    };

    return (
      <div className={styles.panel}>
        <div className={styles.panelEventList}>
          <div className={styles.list}>
            {this.renderEvents(events)}
          </div>
        </div>
        {
        <div className={styles.panelEventList} style={offset_style}>
          <div ref={'eventList'} className={styles.list}>
            <div ref={'eventListItem'} className={styles.listItem}>
              Dummy Event
            </div>
          </div>
        </div>
        }
        {
          events_selected.length
          ? <div className={styles.panelEventListItem}>
              <EventListItem 
                key={events_selected.join('_')} 
                ids={[...events_selected].reverse()} 
                labels={
                  [...events_selected].reverse()
                  .map(id => {
                    let event = this.props.events.find(_ => _.id == id);
                    return event ? moment(event.start_time).format('HH:mm') : '';
                  })
                }
                onCloseTab={id => this.deselectItem(id)} />
            </div>
          : null
        }
      </div>
    );
  }
}

function mapStateToProps(state, props){

  return {
    events: state.events.items,
    status: state.status.items,
    tags: state.tags.items,
    feeds: state.feeds.items,
    filters: state.events.filters,
    next_page: state.events.next_page,
    apply_filters: state.events.apply_filters
  };
}

EventList = connect(mapStateToProps, {
  get_event_list
})(EventList)

export default EventList;
