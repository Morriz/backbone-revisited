var Backbone = require('../backbone-modified');

module.exports = Backbone.LiveModel.extend({

  type: 'songs',

  // Default attributes for the song.
  defaults: {
    id: null,
    title: 'empty title...',
    published: false,
    authorId: null,
    groupId: 1
  },

  initialize: function () {
    // too bad bb events won't accepts an array of event names:
    this.bind('remove', this._removeView, this);
    this.bind('destroy', this._removeView, this);
  },

  // Toggle the 'published' state of this song item.
  toggle: function () {
    this.save({
      published: !this.get('published')
    });
  },

  _removeView: function () {
    if (this.view && !this.view.removing) this.view.remove(false);
  }
});
