ROOT = '/js/';
ONSERVER = false;
ONCLIENT = !ONSERVER;

// and kick off
var app = require('./app');
$(document).ready(app);
