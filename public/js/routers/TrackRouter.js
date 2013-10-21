'use strict';
var _ = require('underscore')
  , views = require('../views/index')
  , models = require('../models/index')
  , Backbone = require('../backbone/backbone-modified')
  ;

module.exports = Backbone.Router.extend({

  routes: {
    'tracks/': 'trackList',
    'tracks/by/:orderBy/dir/:dir/limit/:limit': 'trackList',
    'tracks/by/:orderBy/dir/:dir': 'trackList',
    'tracks/by/:orderBy': 'trackList',
    'tracks/:id': 'track'
  },

  trackList: function (orderBy, dir, limit) {

    var viewCallback;

    if (!this.trackListView) {
      // create model and view
      this.trackListView = new views.TrackList({
        collection: new models.TrackCollection()
      });
    }
    // fetch data
    viewCallback = Backbone.createViewCallback(this.trackListView);
    this.trackListView.collection.fetch({
      sort: {
        by: orderBy,
        dir: dir || 'asc',
        limit: limit
      },
      success: viewCallback,
      error: viewCallback
    });
  },

  track: function (id) {

    var viewCallback;

    id = parseInt(id, 10);

    if (!this.trackView) {
      // create model and view
      this.trackView = new views.Track({model: new models.Track({id: id})});
    } else {
      this.trackView.model.set('id', id);
    }
    // get the data
    viewCallback = Backbone.createViewCallback(this.trackView);
    this.trackView.model.fetch({
      success: viewCallback,
      error: viewCallback
    });
  }
});
