if (typeof module === 'undefined') {
  module = {};
}
module.exports = {
  Song: require('./SongModel'),
  SongCollection: require('./SongCollection'),
  Track: require('./TrackModel'),
  TrackCollection: require('./TrackCollection')
}
