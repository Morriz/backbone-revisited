var Backbone = require('../backbone-modified');

module.exports = Backbone.LiveModel.extend({

  type: 'tracks',

  // Default attributes for the track.
  defaults: {
    id: null,
    title: "empty title...",
    author: 'john doe',
    source: '/sample.aac',
    published: false,
    authorId: 1,
    groupId: null,
    songId: null
  },

  initialize: function () {
    // too bad bb events won't accepts an array of event names:
    this.bind('remove', this._removeView, this);
    this.bind('destroy', this._removeView, this);
  },

  // Toggle the `published` state of this track.
  toggle: function () {
    this.save({
      published: !this.get("published")
    });
  },

  _removeView: function () {
    if (this.view && !this.view.removing) this.view.remove(false);
  }
});
