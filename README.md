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

For those of you that have seen my old "backbone-everywhere" project on github, which I committed over 2 years ago, you might have noticed that I stepped away from the flaky redis/socket.io pubsub. The solution I chose then proved buggy and unworkable. Instead I opted for a more current paradigm, where Backbone is syncing with a rest backend. You might find it fitting for current day needs.

You might also find it pleasing that I made this setup work out of the box. (Even tho I had to do some dirty fixing, see below.)

## Wait, didn't AirBnB do something similar with Rendr?

That's right. I actually took a quick peek at their code just after I finished this stack. And what I saw was pretty complex, obscure and imo not the 'holy grail' we're after.

Actually, I think the clean setup of my stack is more compelling. That I had to use Node.js' unstable 'vm' module is not a bad choice in the end if you ask me. My belief is that Node.js will get widely adopted as a server side MVC solution once the vm module grows mature. It provides the sandbox that is needed to serve each concurrent request a clean environment, while preserving shared pre-built resources.

## Extra's

Cheerio was used for html selecting and parsing on the server. JSdom got the boot (8 times slower).

I added a rest server with in memory storage, that fits the out-of-the-box Backbone sync method.

Href clicks are hijacked and mapped onto the instantiated Backbone routers, using pushState to reflect the app state in the url.

The client has access to all scripts by means of 'require', including templates, which were packaged with browserify. I have also uglified and minified the bundle.js, but not include tools to do so. Please find info on the web.

## Usage

    npm install
    
And start the server:
    
    node server.js
    
Then open this link in your browser:

    http://localhost:8000

## Some notes

### Some hacking was necessary

But the hacking was very minimal this time.

I added " … || $" to the "Backbone.$ = … " line (line 46) to make cheerio's $ available on the server.
(Again, I added node_modules/backbone to git to make it work out of the box.)

Also, to give each connecting user the freshly loaded code that the session needs, I used node.js' vm module, and created a sandbox to prevent the session from touching the global statefullness I wanted to keep.

### Server rendering is a bit slow

The sandboxed execution on the server creates a new context for each request, which costs time.

Nevertheless, I got 45 reqs p/s on my old core 2 duo macbook pro, with 100 simultaneous requests. Mind you, this is without caching.

Actually, it's pretty fast for an initial page load now that I think of it.

### Memory leaks

Maybe because I used vm, which is noted 'unstable', every request leaks some memory. It's probably my own fault tho. I hacked this version over the weekend and got tired. When I have the time to look into this I hope to fix it.

### The EJS module in npm has a bug

I had to copy this version of ejs.js over the one in node_modules/ejs/lib to make it work:
    
    https://github.com/visionmedia/ejs/blob/82f6d373dac280c0984c903ac6735483ad905afb/lib/ejs.js
    
(Too bad TJ didn't bother to publish it back to npm)

Because I wanted this setup to work out of the box I dirtily added node_modules/ejs to git :p
