'use strict';
var _ = require('underscore')
  , songApi = require('../../api/songs')
  ;

module.exports = function songs(app) {

  /**
   * HTTP GET /songs
   * Returns: the list of songs in JSON format
   */
  app.get('/songs/', function (req, res) {
    res.json(songApi.findAll());
  });
  /**
   * HTTP GET /songs/:ids
   * Returns: the filtered set of songs in JSON format
   */
  app.get('/songs/set/:ids', function (req, res) {
    var songs = songApi.filter(_.map(req.params.ids.split(';'), function(item){
      return item + 0;
    }));
    res.json(songs);
  });
  /**
   * HTTP GET /songs/:id
   * Param: :id is the unique identifier of the song you want to retrieve
   * Returns: the song with the specified :id in a JSON format
   * Error: 404 HTTP code if the song doesn't exists
   */
  app.get('/songs/:id', function (req, res) {
    var id = parseInt(req.params.id, 10)
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
  app.post('/songs/', function (req, res) {
    var song = songApi.save(req.body);
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
    var id = parseInt(req.params.id, 10);
    if (!songApi.find(id)) {
      res.send(404);
    }
    songApi.save(req.body);
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
    var id = parseInt(req.params.id, 10);
    if (songApi.remove(id)) {
      return res.send(200);
    }
    res.send(404);
  });
};