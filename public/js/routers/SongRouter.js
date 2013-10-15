var _ = require('underscore');
var views = require('../views/index');
var models = require('../models/index');
var Backbone = require('../backbone-modified');

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

    var self = this
      , tracks
      , viewCallback
      ;

    if (!this.songView) {
      // create model and view
      tracks = new models.TrackCollection();
      tracks.extKey = {
        songId: id
      }
      this.songView = new views.Song({
        model: new models.Song({
          tracks: tracks
        })
      });
    } else {
      tracks = this.songView.model.get('tracks')
    }
    this.songView.model.set('id', id);
    // get the data
    viewCallback = Backbone.createViewCallback(this.songView);
    this.songView.model.fetch({
      success: function () {
        tracks.fetch({
          success: viewCallback,
          error: viewCallback
        });
      },
      error: viewCallback
    });
  }
});
