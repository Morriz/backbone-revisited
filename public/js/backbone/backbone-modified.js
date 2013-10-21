'use strict';
var _ = require('underscore')
  , renderEngine = require('ejs')
  , Backbone = require('backbone')
  ;
// set globals because the authors never intended their stuff to be used with require on the client
if (global.ONCLIENT) {
  global._ = _;
  global.Backbone = Backbone;
};

// pull in the href listeners to enable handling of link clicking
global.ONCLIENT && (require('./backbone-urlhandler'));

Backbone.AnywhereModel = Backbone.Model.extend({

  urlRoot: '/api/',

  url: function () {
    var base = this.urlRoot + this.type + '/';
    if (this.isNew()) {
      return base;
    }
    return base + encodeURIComponent(this.id);
  }

});

Backbone.AnywhereCollection = Backbone.Collection.extend({

  urlRoot: '/api/',

  url: function (models) {
    return this.urlRoot + this.type + ( models ? '/set/' + _.pluck(models, 'id').join(';') + '/' : '/' );
  },

  dateCreated: null, // is always set on server
  dateModified: null, // same
  orderBy: 'dateModified',
  orderDir: 'desc',

  fetch: function (options) {
    options = options || {};
    // keep collection sorting stuff
    var sort = options.sort || null;
    sort && sort.by && (this.orderBy = sort.by);
    sort && sort.dir && (this.orderDir = sort.dir);
    sort && sort.limit && (this.limit = sort.limit.split('-'));
    // and give again
    options.sort = {
      by: this.orderBy,
      dir: this.orderDir,
      limit: this.limit
    };
    // and call parent
    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  // items are sorted by our sortBy value
  comparator: function (item) {
    // since 'this' doesn't reference our own scope we have
    // to resort to the linked collection to get our orderBy
    var orderBy = item.collection.orderBy || item.collection.prototype.orderBy;
    var dir = (item.collection.orderDir || item.collection.prototype.orderDir).toLowerCase();
    var val = item.get(orderBy);
    if (_.isBoolean(val)) {
      return val ? (dir === 'asc' ? 1 : -1) : 0;
    }
    if (_.isNumber(val)) {
      return dir === 'asc' ? val : -val;
    }
    // strings
    if (dir === 'asc') {
      return val;
    } // sorting works fine for asc
    // reverse string sort
    return String.fromCharCode.apply(String,
      _.map(val.split(''), function (c) {
        return 0xffff - c.charCodeAt();
      })
    );
  }
});

var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
Backbone.AnywhereView = Backbone.View.extend({

  constructor: function (options) {

    this.cid = _.uniqueId('view');
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    // add in our special events
    this.events = this.events || {};
    _.extend(this.events, Backbone.View.prototype.events);
    if (this.template) {
      var data = (this.model && this.model.toJSON()) || (this.collection && this.collection.toJSON()) || {};
      this.$el.html(this.template(data));
    }
    if (global.ONCLIENT) {
      this.delegateEvents();
    }
    this.initialize.apply(this, arguments);
  },

  renderEngine: renderEngine,

  show: function () {
    this.$el.css('display', 'block');
  },

  hide: function () {
    this.$el.css('display', 'none');
  }
});

// creates callback that holds view function for convenience
Backbone.createViewCallback = function (view) {
  return function () {
    Backbone.onlyShowLayout(view);
    if (global.ONSERVER) {
      global.sendFullHtmlToClient();
    }
  };
};

// func to toggle layout visibility
Backbone.onlyShowLayout = function (layoutToShow) {
  global.$('.layout:not(.fixed)').css('display', 'none');
  layoutToShow.show();
};

module.exports = Backbone;
