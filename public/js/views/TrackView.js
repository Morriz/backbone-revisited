'use strict';
var root = typeof window === 'undefined' ? global : window
  , _ = require('underscore')
  , Backbone = require('../backbone/backbone-modified')
  , template = require('../templates/track.ejs')
  ;

module.exports = Backbone.AnywhereView.extend({

  el: '#track-view',

  template: template,

  // The DOM events specific to an item.
  events: {
    'dblclick div.content': 'edit',
    'click span.destroy': 'clear',
    'blur .track-input': 'close'
  },

  // The SongView listens for changes to its model, re-rendering. Since
  // there's a one-to-one correspondence between a **Song** and a **SongView**
  // in this
  // app, we set a direct reference on the model for convenience.
  initialize: function () {
    this.initModel();
  },

  initModel: function () {
    this.listenTo(this.model, 'change', this.render);
    this.model.view = this;
    this.render();
  },

  // Re-render the contents of the track item.
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
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
