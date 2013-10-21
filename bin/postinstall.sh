#!/bin/bash

# just rewrite the last line in backbone.js to make it use node.js' global else window as 'this'

sed 's/}).call(this);/}).call(global || window);/g' node_modules/backbone/backbone.js > bb.js
mv bb.js node_modules/backbone/backbone.js

# then copy the working version of ejs over the faulty one from npm
cp node_mods/ejs.js node_modules/ejs/lib/