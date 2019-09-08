# Callback Router

Are you reluctantly adding routing to your web app? Say no more!

Most routers map a URL to some UI. **Callback Router** is a little different;
instead of mapping URLs directly to the components that render the page, this
library is a tiny hook into the history API that lets you map URLs to callback
functions that can do pretty much whatever you want!

Perhaps you need to maintain a meaningful URL for one reason or another, but you
don't want `window.location` totally running the show in your Single-Page App.
Using Callback Router allows you to keep the URL as far away from application
state as you like.


## Libraries

This whole thing exists because I didn't like having the full app state split
across the URL and the store when using React Router and Redux together.
In the interest of modularity, this repository is split up into four libraries,
so you can use the parts you need!

### [callback-router]

Core implementation that allows you to map routes to callbacks and integrate
with the browser history API.

### [react-use-callback-router]

React hook interface for Callback Router.

### [redux-callback-router]

This is the Redux flavor of Callback Router, which allows you to keep the URL
synchronized with your Redux state In addition to generic callbacks, you can map
routes to action creators so that navigation will dispatch an action.

### [react-use-redux-callback-router]

React hook interface for Redux Callback Router.


## License

ISC © [Keith McKnight](https://github.com/kmck)


[callback-router]: /packages/callback-router
[react-use-callback-router]: /packages/react-use-callback-router
[redux-callback-router]: /packages/redux-callback-router
[react-use-redux-callback-router]: /packages/react-use-redux-callback-router
