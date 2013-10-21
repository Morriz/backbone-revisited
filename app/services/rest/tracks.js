'use strict';
var _ = require('underscore')
  , trackApi = require('../../api/tracks')
  ;

module.exports = function tracks(app) {

  /**
   * HTTP GET /tracks/
   * Returns: the list of tracks in JSON format
   */
  app.get('/tracks/', function (req, res) {
    res.json(trackApi.findAll());
  });
  /**
   * HTTP GET /tracks/:ids
   * Returns: the filtered set of tracks in JSON format
   */
  app.get('/tracks/set/:ids', function (req, res) {
    var songs = trackApi.filter(_.map(req.params.ids.split(';'), function (item) {
      return parseInt(item, 10);
    }));
    res.json(songs);
  });
  /**
   * HTTP GET /tracks/:id
   * Param: :id is the unique identifier of the track you want to retrieve
   * Returns: the track with the specified :id in a JSON format
   * Error: 404 HTTP code if the track doesn't exists
   */
  app.get('/tracks/:id', function (req, res) {
    var id = parseInt(req.params.id, 10)
      , track = trackApi.find(id)
      ;
    if (track) {
      return res.json(track);
    }
    res.send(404);
  });
  /**
   * HTTP POST /tracks/
   * Body Param: the JSON track you want to create
   * Returns: 200 HTTP code
   */
  app.post('/tracks/', function (req, res) {
    var track = trackApi.save(req.body);
    res.json(track);
  });
  /**
   * HTTP PUT /tracks/
   * Param: :id the unique identifier of the track you want to update
   * Body Param: the JSON track you want to update
   * Returns: 200 HTTP code
   * Error: 404 HTTP code if the track doesn't exists
   */
  app.put('/tracks/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    if (!trackApi.find(id)) {
      res.send(404);
    }
    trackApi.save(req.body);
    res.send(200);
  });
  /**
   * HTTP PUT /tracks/
   * Param: :id the unique identifier of the track you want to update
   * Body Param: the JSON track you want to update
   * Returns: 200 HTTP code
   * Error: 404 HTTP code if the track doesn't exists
   */
  app.delete('/tracks/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);
    if (trackApi.remove(id)) {
      return res.send(200);
    }
    res.send(404);
  });
};