var songApi = require('../../api/songs');

module.exports = function songs(app) {

  /**
   * HTTP GET /songs
   * Returns: the list of songs in JSON format
   */
  app.get('/songs', function (req, res) {
    res.json(songApi.findAll());
  });
  /**
   * HTTP GET /songs/:id
   * Param: :id is the unique identifier of the song you want to retrieve
   * Returns: the song with the specified :id in a JSON format
   * Error: 404 HTTP code if the song doesn't exists
   */
  app.get('/songs/:id', function (req, res) {
    var id = req.params.id
      , song = songApi.find(id)
      ;
    if (song) {
      return res.json(song);
    }
    res.send(404);
  });
  /**
   * HTTP POST /songs/
   * Body Param: the JSON song you want to create
   * Returns: 200 HTTP code
   */
  app.post('/songs', function (req, res) {
    var song = req.body
      , song = songApi.save({
        title: song.title || 'Default title',
        description: song.description || 'Default description',
        dueDate: song.dueDate,
        status: song.status || 'not completed'
      })
      ;
    res.json(song);
  });
  /**
   * HTTP PUT /songs/
   * Param: :id the unique identifier of the song you want to update
   * Body Param: the JSON song you want to update
   * Returns: 200 HTTP code
   * Error: 404 HTTP code if the song doesn't exists
   */
  app.put('/songs/:id', function (req, res) {
    var song = req.body;
    var id = req.params.id;
    var persistedSong = songApi.find(id);
    if (!persistedSong) {
      res.send(404);
    }
    songApi.save({
      id: persistedSong.id,
      title: song.title || persistedSong.title,
      description: song.description || persistedSong.description,
      dueDate: song.dueDate || persistedSong.dueDate,
      status: song.status || persistedSong.status
    });
    res.send(200);

  });
  /**
   * HTTP PUT /songs/
   * Param: :id the unique identifier of the song you want to update
   * Body Param: the JSON song you want to update
   * Returns: 200 HTTP code
   * Error: 404 HTTP code if the song doesn't exists
   */
  app.delete('/songs/:id', function (req, res) {
    if (songApi.remove(req.params.id)) {
      return res.send(200);
    }
    res.send(404);
  });
}