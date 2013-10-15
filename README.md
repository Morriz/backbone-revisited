# Songlist, based upon the Todo app by Jeremy Ashkenase.


## Technologies

+ Node
+ Express
+ Backbone
+ REST api
+ Browserify
+ HTML5's pushState

## Browser compatibility

I have tested this app to work with Chrome 30, but assume it will work with most modern browsers.

## Why this app?

I have created this app as a demo to show that Backbone can be used in full effect on the server, to render stateful server side views that continue to live in the browser.

The Backbone MVC stack is first used on the server, and then the client handles it from there. No full page rendering is necessary afterwards.
If no javascript is available, the html output from the server will still be the same.

Hopefully this setup can be used as an example to create a web application that complies with the "write once, run anywhere" paradigm.

## Extra's

Cheerio was used for html selecting and parsing on the server.

I added a rest server with in memory storage, that fits the out-of-the-box Backbone sync method.

Href clicks are hijacked and mapped onto the instantiated Backbone routers, using pushState to reflect the app state in the url.

The client has access to all scripts by means of 'require', including templates, which were packaged with browserify. I have also uglified and minified the bundle.js, but not include tools to do so. Please find info on the web.

## Usage

    npm install
    
Then add " || $" to the end of this line to make the server find cheerio's $:

    node_modules/backbone/backbone.js:46

And start the server:
    
    node server.js
    
Then open this link in your browser:

    http://localhost:8000

## Issues with this setup

### Server rendering is rather slow

The sandboxed execution on the server creates a new context for each request, which costs time.

Nevertheless, I got 45 reqs p/s on my old core 2 duo macbook pro, with 100 simultaneous requests.

### Some hacking was necessary

But the hacking was very minimal this time.

I added " … || $" to the "Backbone.$ = … " line (line 46)to make cheerio's $ available on the server.

Also, to give each connecting user the freshly loaded code that the session needs, I used node.js' vm module, and created a sandbox to prevent the session from touching the global statefullness I wanted to keep.

### Memory leaks

Maybe because I used vm, which is noted 'unstable', every request leaks some memory. When I have the time to look into this I hope to fix it.
