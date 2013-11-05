module.exports = function sync(method, model, options) {

  var resp
    , store = require('../app/api/' + model.type)
    ;

  switch (method) {
    case "read":
      resp = model.id ? store.find(model.id) : store.findAll();
      break;
    case "create":
      resp = store.create(model);
      break;
    case "update":
      resp = store.update(model);
      break;
    case "delete":
      resp = store.destroy(model);
      break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};