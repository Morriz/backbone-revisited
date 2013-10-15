var trackApi = require('../../api/tracks');

module.exports = function tracks(app) {

  /**
   * HTTP GET /tracks
   * Returns: the list of tracks in JSON format
   */
  app.get('/tracks', function (req, res) {
    res.json(trackApi.findAll());
  });
  /**
   * HTTP GET /tracks/:id
   * Param: :id is the unique identifier of the track you want to retrieve
   * Returns: the track with the specified :id in a JSON format
   * Error: 404 HTTP code if the track doesn't exists
   */
  app.get('/tracks/:id', function (req, res) {
    var id = req.params.id
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
  app.post('/tracks', function (req, res) {
    var track = req.body
      , track = trackApi.save({
        title: track.title || 'Default title',
        description: track.description || 'Default description',
        dueDate: track.dueDate,
        status: track.status || 'not completed'
      })
      ;
    res.json(track);
  });
  /**
   * HTTP PUT /tracks/
   * Param: :id the unique identifier of the track you want to update
   * Body Param: the JSON track you want to update
   * Returns: 200 HTTP code
   * Error: 404 HTTP code if the track doesn't exists
   */
  app.put('/tracks:/id', function (req, res) {
    var track = req.body;
    var id = req.params.id;
    var persistedTrack = trackApi.find(id);
    if (!persistedTrack) {
      res.send(404);
    }
    trackApi.save({
      id: persistedTrack.id,
      title: track.title || persistedTrack.title,
      description: track.description || persistedTrack.description,
      dueDate: track.dueDate || persistedTrack.dueDate,
      status: track.status || persistedTrack.status
    });
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
    if (trackApi.remove(req.params.id)) {
      return res.send(200);
    }
    res.send(404);
  });
}