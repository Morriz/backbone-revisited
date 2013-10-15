// Override `Backbone.sync` to use delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
var _ = require('underscore')
  , sync = function(method, model, options) {

  var resp;
  // we can find our store somewhere for sure
  var store = require('../app/api/' + model.type);

  switch (method) {
    case "read":    resp = model.id ? store.find(model.id) : store.findAll(); break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};

module.exports = sync;
