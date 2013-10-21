var global = window || global;
global.ROOT = '/js/';
global.ONSERVER = !window;
global.ONCLIENT = window;

// and kick off
var app = require('./app');
$(document).ready(app);
