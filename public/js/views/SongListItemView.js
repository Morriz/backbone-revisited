'use strict';
var _ = require('underscore')
  , Backbone = require('../backbone/backbone-modified')
  , template = require('../templates/songlistItem.ejs')
  ;

module.exports = Backbone.AnywhereView.extend({

  tagName: 'li',

  template: template,

  // The DOM events specific to an item.
  events: {
    'click .song-check': 'toggleActivated',
    'dblclick div.song-content': 'edit',
    'click span.song-destroy': 'remove',
    'keypress .song-input': 'updateOnEnter'
  },

  // The SongView listens for changes to its model, re-rendering. Since
  // there's a one-to-one correspondence between a **Song** and a **SongView** in this
  // app, we set a direct reference on the model for convenience.
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this._enrich();
    this.model.view = this;
  },

  // Render the contents of the song item.
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    this._enrich();
    return this;
  },

  _enrich: function () {
    if (global.ONSERVER) {
      return;
    }
    this.input = this.$('.song-input').on('blur', _.bind(this.close, this));
  },

  // Toggle the 'published' state of the model.
  toggleActivated: function () {
    this.model.toggle();
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

  // Remove this view from the DOM.
  remove: function () {
    if (this.removing) {
      return;
    }
    this.removing = true;
    this.model.destroy();
    Backbone.AnywhereView.prototype.remove.apply(this);
  },

  // Remove the item, destroy the model.
  clear: function () {
    this.model.clear();
  }
});
