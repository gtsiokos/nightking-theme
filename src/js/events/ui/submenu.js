import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import DayPicker from 'react-day-picker';
import debounce from 'lodash/debounce';
import moment from 'moment';

import { login_required } from '../../utils/decorators';
import { ButtonGroup } from '../../ui/button/group';
import { TagList, TagListItem} from '../../ui/tag';

import { get_feed_list } from '../../actions/feeds';
import { get_tag_list } from '../../actions/tags';
import { get_status_list } from '../../actions/status';
import { set_filter, apply_filters } from '../../actions/events';

import styles from '../../../css/sidepanel.css';

@login_required
class Submenu extends React.Component {

  constructor(){
    super();

    this.onFilterChange     = this.onFilterChange.bind(this);
  }

  componentWillMount(){
    return Promise
      .resolve()
      .then(() => this.props.get_status_list())
      .then(() => this.props.get_tag_list())
      .then(() => this.props.get_feed_list())
      .then(() => {
        if(!this.props.filters['feed']){
          this.props.set_filter(
            'feed',
            this.props.feeds.map(e => e.id)
          );
        }

        if(!this.props.filters['tag']){
          this.props.set_filter(
            'tag',
            this.props.tags.map(e => e.id)
          );
        }

        if(!this.props.filters['status']){
          this.props.set_filter(
            'status',
            this.props.status.map(e => e.id)
          );
        }

        if(!this.props.filters['date']){
          this.props.set_filter(
            'date',
            new Date()
          );
        }

        this.props.apply_filters();    
      });
  }

  onFilterChange(k, v){
    this.props.set_filter(k, v);
    this.props.apply_filters();
  }

  render(){
    let tag_cls = `fa fa-tag ${styles.submenuTag}`;

    return (
      <div className={styles.submenu} >
        {
          this.props.display_filters.includes('date')
          ? <DayPicker
            //initialMonth={this.props.month}
            selectedDays={date => {
              date = moment(date);
              let is_current_month = date.isSame(this.props.filters.date, 'month');

              if(!is_current_month) return false;

              return date.isSame(this.props.filters.date, 'day');
            }}
            showOutsideDays={true}
            onDayClick={date => this.onFilterChange('date', date)}
            //onMonthChange={this.onMonthChange}
            //renderDay={this.renderDay}
            />
          : null
        }
        {
          this.props.display_filters.includes('feed') && this.props.feeds.length
          ? <React.Fragment>
              <span className={styles.submenuTitle}>Feeds</span>
              <TagList onChange={ values => this.onFilterChange('feed', values) }>
              {
                this.props.feeds.map(item => {
                  let selected = this.props.filters['feed']
                    ? this.props.filters['feed'].includes(item.id)
                    : true;

                  return (
                    <TagListItem key={item.id} id={item.id} color={item.color} selected={selected}>
                      <span className={tag_cls} />
                      {item.name}
                    </TagListItem>
                  );
                }
                )
              }
              </TagList>
            </React.Fragment>
          : null
        }
        {
          this.props.display_filters.includes('status') && this.props.feeds.length
          ? <React.Fragment>
              <span className={styles.submenuTitle}>Statuses</span>
              <TagList onChange={ values => this.onFilterChange('status', values) }>
              {
                this.props.status.map(item => {
                  let selected = this.props.filters['status']
                    ? this.props.filters['status'].includes(item.id)
                    : true;

                  return (
                    <TagListItem key={item.id} id={item.id} selected={selected}>
                      <span className={tag_cls} />
                      {item.name}
                    </TagListItem>
                  );
                }
                )
              }
              </TagList>
            </React.Fragment>
          : null
        }
        {
          this.props.display_filters.includes('tag') && this.props.feeds.length
          ? <React.Fragment>
              <span className={styles.submenuTitle}>Popular Tags</span>
              <TagList onChange={ values => this.onFilterChange('tag', values) }>
              {
                this.props.tags.map(item => {
                  let selected = this.props.filters['tag']
                    ? this.props.filters['tag'].includes(item.id)
                    : true;

                  return (
                    <TagListItem key={item.id} id={item.id} selected={selected}>
                      <span className={tag_cls} />
                      {item.name}
                    </TagListItem>
                  );
                }
                )
              }
              </TagList>
            </React.Fragment>
          : null
        }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    filters: state.events.filters,
    status: state.status.items,
    feeds: state.feeds.items,
    tags: state.tags.items,
  };
}

Submenu = connect(mapStateToProps, {
  get_tag_list,
  get_feed_list,
  get_status_list,
  apply_filters,
  set_filter,
})(Submenu);

export default Submenu;
