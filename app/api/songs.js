/**
 * SongApi class deals with song persistence
 */
module.exports = {

  songs: [],
  nextId: 1,
  /**
   * Find a song by id
   * Param: id of the song to find
   * Returns: the song corresponding to the specified id
   */
  find: function (id) {
    var song = this.songs.filter(function (item) {
      return item.id == id;
    })[0];
    return song;
  },
  /**
   * Find the index of a song
   * Param: id of the song to find
   * Returns: the index of the song identified by id
   */
  findIndex: function (id) {
    var index = null;
    this.songs.forEach(function (item, key) {
      if (item.id == id) {
        index = key;
      }
    });
    return index;
  },
  /**
   * Retrieve all songs
   * Returns: array of songs
   */
  findAll: function () {
    return this.songs;
  },
  /**
   * Save a song (create or update)
   * Param: song the song to save
   */
  save: function (song) {
    if (song.id == null || song.id == 0) {
      song.id = this.nextId;
      this.songs.push(song);
      this.nextId++;
    } else {
      var index = this.findIndex(song.id);
      this.songs[index] = song;
    }
    return song;
  },
  /**
   * Remove a song
   * Param: id the of the song to remove
   */
  remove: function (id) {
    var index = this.findIndex(id);
    if (index === null) return false;
    this.songs.splice(index, 1);
    return true;
  }
}