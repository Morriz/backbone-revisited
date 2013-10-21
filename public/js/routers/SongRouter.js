'use strict';
var _ = require('underscore')
  , views = require('../views/index')
  , models = require('../models/index')
  , Backbone = require('../backbone/backbone-modified')
  ;

module.exports = Backbone.Router.extend({

  routes: {
    '': 'songList',
    'songs/': 'songList',
    'songs/by/:orderBy/dir/:dir/limit/:limit': 'songList',
    'songs/by/:orderBy/dir/:dir': 'songList',
    'songs/by/:orderBy': 'songList',
    'songs/:id': 'song'
  },

  songList: function (orderBy, dir, limit) {

    var viewCallback;

    if (!this.songListView) {
      // create model and view
      this.songListView = new views.SongList({
        collection: new models.SongCollection()
      });
    }
    // fetch data
    viewCallback = Backbone.createViewCallback(this.songListView);
    this.songListView.collection.fetch({
      sort: {
        by: orderBy,
        dir: dir || 'asc',
        limit: limit
      },
      success: viewCallback,
      error: viewCallback
    });
  },

  song: function (id) {

    var viewCallback;

    id = parseInt(id, 10);

    if (!this.songView) {
      // create model and view
      this.songView = new views.Song({model: new models.Song({id: id})});
    } else {
      this.songView.model.set('id', id);
    }
    // get the data
    viewCallback = Backbone.createViewCallback(this.songView);
    this.songView.model.fetch({
      success: viewCallback,
      error: viewCallback
    });
  }
});
