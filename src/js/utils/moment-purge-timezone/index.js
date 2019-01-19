
(function() {

  // define internal moment reference
  var moment;

  if (typeof require === "function") {
    try { moment = require('moment'); }
    catch (e) {}
  }

  if (!moment && root.moment) {
    moment = root.moment;
  }

  if (!moment) {
    throw "Cannot find Moment.js";
  }

  moment.fn.purgeTimezone = function() {
    //return moment.utc(this.add(this._tzm, 'm').toISOString());
    return this.utcOffset(this._tzm);
  }
})(this);