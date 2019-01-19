var uuid            = require('uuid');
var casual          = require('casual');
var moment          = require('moment');
var momentrange     = require('moment-range');
var sortBy          = require('lodash/sortBy');
moment              = momentrange.extendMoment(moment);

const FEEDS = [
  { id: casual.uuid, name: 'Facebook', url:'', color:'#3C5A99' },
  { id: casual.uuid, name: 'Instagram', url:'', color:'#E05372' },
  { id: casual.uuid, name: 'Twitter', url:'', color:'#1DA1F2' },
];

const TAGS = [
  { id: casual.uuid, name: 'Live DJ' },
  { id: casual.uuid, name: 'Outdoor'},
  { id: casual.uuid, name: 'Hiking'},
  { id: casual.uuid, name: 'Cinema'},
  { id: casual.uuid, name: 'Football'},
  { id: casual.uuid, name: 'Concert'},
];

const STATUSES = [
  { id: 'UPCOMING', name: 'Upcoming' },
  { id: 'INPROGRESS', name: 'In Progress' },
  { id: 'ENDED', name: 'Ended' },
];

casual.seed('nightking');

casual.define('nightking_tag', () => {
  return casual.random_element(TAGS.map(_ => _.id));
});

casual.define('nightking_tags', (num) => {
  return new Array(num).fill().map(_ => casual.nightking_tag);
});

casual.define('nightking_photo', (w, h, tags=[]) => {
  return {
    alt: casual.sentences(2),
    src: `https://source.unsplash.com/${w}x${h}/?${tags.join(',')}&${uuid()}`
  };
});

casual.define('nightking_photos', (num, tags) => {
  return new Array(num).fill().map(_ => casual.nightking_photo(1100, 220, tags));
});

casual.define('nightking_random_date', (start, end) => {
  let range = moment.range(start, end);
  let date = casual.random_element(Array.from(range.by('days')));

  date.hour(casual.integer(8, 23));
  date.minutes(casual.integer(0, 59));
  date.seconds(casual.integer(0, 59));

  return date;
});

casual.define('nightking_status', (start, end) => {
  let now = moment();
  let time = moment.range(start, end);

  return time.contains(now)
    ? STATUSES[1]
    : end.isBefore(now)
      ? STATUSES[2]
      : STATUSES[0];
});

casual.define('nightking_event', () => {
  let tags = casual.nightking_tags(casual.integer(1,2)).sort((a,b) => a.id < b.id);
  let tag_names = tags.map(id => TAGS.find(tag => tag.id == id).name);

  let start = moment().subtract(5, 'days');
  let end = moment().add(13, 'days');

  let date = casual.nightking_random_date(start, end);
  date.minutes(date.minutes() - date.minutes() % 10);
  date.seconds(0);

  let duration = casual.random_element([60, 90, 120, 180]);
  let start_time = date;
  let end_time = moment(date).add(duration, 'minutes');

  let status = casual.nightking_status(start_time, end_time);
  let desc = [
    casual.sentences(casual.integer(5,10)),
    casual.sentences(casual.integer(10,15)),
  ].join('\r\n');

  return {
    _date: date.toDate(),
    tags: tags,
    id: casual.uuid,
    title: casual.sentences(1),
    date: date.format('YYYY-MM-DD'),
    start_time: start_time.format('YYYY-MM-DDTHH:mm:ssZ'),
    end_time: end_time.format('YYYY-MM-DDTHH:mm:ssZ'),
    photos: casual.nightking_photos(1, tag_names),
    feed: casual.random_element(FEEDS.map(_ => _.id)),
    address: casual.address,
    status: status.id,
    desc: desc,
  };
});

let data = {};
let events = new Array(3000).fill().map(_ => casual.nightking_event);

data.events = sortBy(events, ['_date']);
data.feeds = FEEDS;
data.tags = TAGS;
data.status = STATUSES;

module.exports = () => data;