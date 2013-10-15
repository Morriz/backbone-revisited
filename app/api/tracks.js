/**
 * TrackApi class deals with track persistence
 */
module.exports = {

  tracks: [],
  nextId: 1,
  /**
   * Find a track by id
   * Param: id of the track to find
   * Returns: the track corresponding to the specified id
   */
  find: function (id) {
    var track = this.tracks.filter(function (item) {
      return item.id == id;
    })[0];
    return track;
  },
  /**
   * Find the index of a track
   * Param: id of the track to find
   * Returns: the index of the track identified by id
   */
  findIndex: function (id) {
    var index = null;
    this.tracks.forEach(function (item, key) {
      if (item.id == id) {
        index = key;
      }
    });
    return index;
  },
  /**
   * Retrieve all tracks
   * Returns: array of tracks
   */
  findAll: function () {
    return this.tracks;
  },
  /**
   * Save a track (create or update)
   * Param: track the track to save
   */
  save: function (track) {
    if (track.id == null || track.id == 0) {
      track.id = this.nextId;
      this.tracks.push(track);
      this.nextId++;
    } else {
      var index = this.findIndex(track.id);
      this.tracks[index] = track;
    }
    return track;
  },
  /**
   * Remove a track
   * Param: id the of the track to remove
   */
  remove: function (id) {
    var index = this.findIndex(id);
    if (index === null) return false;
    this.tracks.splice(index, 1);
    return true;
  }
}