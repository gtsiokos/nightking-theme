import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import uuid from 'uuid';
import moment from 'moment';
import {
  Tab, 
  Tabs, 
  TabList, 
  TabPanel 
} from 'react-tabs';

import 'moment-duration-format';
import '../utils/moment-purge-timezone';

import {error_catched_by} from '../utils/decorators';
import {get_event} from '../actions/events'

import styles from '../../css/events.css'


class EventListItem extends React.Component {
    constructor(){
      super();

      this.onSwitchTab = this.onSwitchTab.bind(this);
      this.onCloseTab = this.onCloseTab.bind(this);
      this.renderListItem = this.renderListItem.bind(this);
    }

    componentWillMount(){
      this.props.get_event(this.props.ids[0]);
    }

    onSwitchTab(id){
      this.props.get_event(id);
    }

    onCloseTab(id){
      if(this.props.onCloseTab){
        this.props.onCloseTab(id);
      }
    }

    formatIfDate(str){
      let d = moment(str, 'YYYY-MM-DDTHH:mm:ssZ', true);
      if(d.isValid()){
        return d.purgeTimezone().format('HH:mm:ss');
      }
      return str;
    }

    renderListItem(){
      let event = this.props.event;
      let cover = this.props.event.photos[0];

      let format = {
        lastDay: '[Yesterday at] LT', lastWeek: 'DD MMM [at] LT', 
        sameDay: '[Today at] LT', sameElse: 'DD MMM [at] LT',
        nextDay: '[Tomorrow at] LT', nextWeek: 'DD MMM [at] LT',
      };

      let start_time = moment(event.start_time);
      let end_time = moment(event.end_time);
      let str_start_time = start_time.calendar(null, format);
      let str_end_time = end_time.isSame(start_time, 'day')
        ? end_time.format('LT')
        : end_time.calendar(null, format);

      return (
        <div >
          <div className={styles.listItemCover}>
            <img src={cover.src} alt={''} />
          </div>

          <div className={styles.listItemInfo}>
            <div className={styles.listItemDate}>
              <span>{start_time.format('MMM').toUpperCase()}</span>
              <span>{start_time.format('DD')}</span>
            </div>
            <div className={styles.listItemTitle}>
              {event.title}
            </div>
          </div>

          <div className={styles.listItemDetails}>
            <div className={styles.listItemDetailsItem}>
              <span><span className='fa fa-clock-o'></span></span>
              <span>{str_start_time} &ndash; {str_end_time}</span>
            </div>
            <div className={styles.listItemDetailsItem}>
              <span><span className='fa fa-map-marker'></span></span>
              <span>{event.address}</span>
            </div>
            <div className={styles.listItemDetailsItem}>
              <span><span className='fa fa-tag'></span></span>
              <span>
              {
                this.props.tags
                .filter(tag => event.tags.includes(tag.id))
                .map(tag => tag.name)
                .join(', ')
              }
              </span>
            </div>
          </div>
          
          <div className={styles.listItemDesc}>
            {event.desc}
          </div>

          <div className={styles.listItemPhotos}>
          {
            this.props.event.photos.slice(1).map((img, index) => {
              return <img key={index} src={img.src} alt={img.alt} />
            })
          }
          </div>
        </div>
      );
    }

    render() {
      if(!this.props.event) return null;

      let tab_style = {
        paddingRight: '29rem'
      };

      let close_btn_style = {
        position: 'absolute',
        right: '13rem',
        opacity: 0.37
      };

      return (
        <Tabs>
          <TabList>
          {
            this.props.ids.map((id, index) => {
              return (
                <Tab key={id} onClick={this.onSwitchTab.bind(this, id)} style={tab_style}>
                  <span className={'fa fa-clock-o'} style={{marginRight:'7rem'}} />
                  <span>{this.props.labels[index]}</span>
                  <span className='fa fa-times' style={close_btn_style} onClick={() => this.onCloseTab(id)} />
                </Tab>
              );
            })
          }
          </TabList>

          {
            this.props.ids.map(id => {
              return (
                <TabPanel key={id}>
                  {this.renderListItem()}
                </TabPanel>
              );
            })
          }
        </Tabs>
      );
    }
}

function mapStateToProps(state, props) {
  let event = Object.keys(state.events.item_selected).length 
    ? state.events.item_selected
    : null;

  return {
    event,
    tags: state.tags.items
  };
}

EventListItem = connect(mapStateToProps, {
  get_event
})(EventListItem);

export default EventListItem;
