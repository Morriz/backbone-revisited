'use strict';
var _ = require('underscore')
  , Backbone = require('../backbone/backbone-modified')
  , models = require('../models/index')
  , TrackListView = require('./TrackListView')
  , template = require('../templates/song.ejs')
  ;

module.exports = Backbone.AnywhereView.extend({

  el: '#song-view',

  template: template,

  subViews: {},

  // The DOM events specific to an item.
  events: {
    'dblclick div.content': 'edit',
    'click span.destroy': 'clear',
    'blur .song-input': 'close'
  },

  initialize: function () {
    this.initModel();
    this.input = this.$('.song-input');
  },

  // The SongView listens for changes to its model, re-rendering. Since
  // there's a one-to-one correspondence between a Song and a SongView
  // in this app, we set a direct reference on the model for convenience.
  initModel: function () {
    this.model.view = this;
    this.collection = new models.TrackCollection(this.model.get('tracks'));
    // keep ref for later
    this.collection.songId = this.model.id;
    this.listenTo(this.model, 'change', function() {
      this.render();
      this.collection.set(this.model.get('tracks'));
    });
    this.render();
    this.initTracksView();
  },

  initTracksView: function () {
    this.subViews.trackList = new TrackListView({
      el: '.tracklist-subview',
      collection: this.collection
    });
  },

  // Re-render the contents of the song item.
  render: function () {
    var self = this;
    _.each(this.model.toJSON(), function (val, prop) {
      var isBool = _.isBoolean(val);
      if (!isBool && val && typeof val === 'object') {
        return;
      }
      if (isBool) {
        val = val ? 'yes' : 'no';
      }
      self.$('span.' + prop).html(val + '');
      self.$('input.' + prop).val(val + '');
    });
    return this;
  },

  // Switch this view into 'editing' mode, displaying the input field.
  edit: function () {
    this.$el.addClass('editing');
    this.input.focus();
  },

  // Close the 'editing' mode, saving changes to the song.
  close: function () {
    this.model.save({
      title: this.input.val()
    });
    this.$el.removeClass('editing');
  },

  // If you hit enter, we're through editing the item.
  updateOnEnter: function (e) {
    if (e.keyCode === 13) {
      this.close();
    }
  },

  // clear the model.
  clear: function () {
    this.model.clear();
  }

});
