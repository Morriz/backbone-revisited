'use strict';
var _ = require('underscore')
  , Backbone = require('../backbone/backbone-modified')
  , template = require('../templates/songlist.ejs')
  , songlistStatsTemplate = require('../templates/songlistStats.ejs')
  ;

module.exports = Backbone.AnywhereView.extend({

  el: '#songlist-view',

  template: template,

  statsTemplate: songlistStatsTemplate,

  // Delegated events for creating new items, and clearing completed ones.
  events: {
    'keypress .song-new': 'createOnEnter',
    'keyup .song-new': 'showTooltip',
    'click .song.clear a': 'clearCompleted'
  },

  // At initialization we bind to the relevant events on the SongList
  // collection, when items are added or changed. Kick things off by
  // loading any preexisting songCollection that might be saved
  initialize: function () {
    // setup our input
    this.input = this.$('.song-new');
    // attach handlers
    this.listenTo(this.collection, 'add', this.addOne);
    this.listenTo(this.collection, 'reset', this.addAll);
    this.listenTo(this.collection, 'all', this.render);
  },

  // Re-rendering the App just means refreshing the statistics -- the rest
  // of the app doesn't change.
  render: function () {
    // only rerender the stats part
    var html = this.statsTemplate({
      total: this.collection.length,
      published: this.collection.published().length,
      remaining: this.collection.remaining().length
    });
    this.$('.songlist-stats').html(html);
  },

  // Add a single song item to the list by creating a view for it, and
  // appending its element to the <ul>.
  addOne: function (song, index) {
    // DIRRRTY: prevent too many items rendering
    if (this.collection.limit && index === this.collection.limit[1]) {
      return;
    }
    var SongListItemView = require('../views/index').SongListItem;
    var $el = new SongListItemView({
      model: song
    }).render().$el;
    this.$('.songlist').append($el);
  },

  // Add all items in the SongList collection at once.
  addAll: function () {
    // clear songCollection first
    this.$('.songlist').html('');
    this.collection.each(this.addOne.bind(this));
  },

  // Generate the attributes for a new Song item.
  newAttributes: function () {
    return {
      title: this.input.val(),
      order: this.collection.nextOrder(),
      published: false
    };
  },

  // If you hit return in the main input field, create new Song model and persist.
  createOnEnter: function (e) {
    if (e.keyCode !== 13) {
      return;
    }
    this.collection.create(this.newAttributes(), {wait: true});
    this.input.val('');
  },

  // Destroy all published song models.
  clearCompleted: function () {
    _.each(this.collection.published(), function (song) {
      song.destroy();
    });
    return false;
  },

  // Lazily show the tooltip that tells you to press enter to save
  // a new song item, after one second.
  showTooltip: function (e) {
    var tooltip = this.$('.ui-tooltip-top');
    var val = this.input.val();
    tooltip.fadeOut();
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    if (val === '' || val === this.input.attr('placeholder')) {
      return;
    }
    var show = function () {
      tooltip.show().fadeIn();
    };
    this.tooltipTimeout = _.delay(show, 1000);
  }

});
