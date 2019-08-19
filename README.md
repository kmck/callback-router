# Callback Router

Are you reluctantly adding routing to your web app? Say no more!

This library is a tiny hook into the history API that lets you register routes with callbacks and
do whatever you want from there. This is useful for cases where you don't want `window.location`
to run the show, but URLs still matter for one reason or another.

For example, maybe you're using a central application state to handle navigation already, but you
would like pages to be bookmarkable or shareable. Maybe there is some nuance to the navigation
state that simply cannot be captured in a single string of text.

## Installation

```bash
npm install callback-router
```

```bash
yarn add callback-router
```

## Usage

```js
// @TODO
```

### Routing

A basic route maps a `path` to a `callback`. The pathname is processed on router initialization and
on `popstate` events. When a route is matched, its `callback` is invoked.

The pathname is _not_ necessarily processed for imperative history changes, such as when using
`history.pushState()` and `history.replaceState()`, but you can enable that behavior per route by
enabling the `navigate` property.

Routes are evaluated in order of most- to least-specific, regardless of the registration order.
You can prevent this behavior in a few ways, if necessary. Defining a route as `exact` will
require an exact path match. Defining a route as `last` will interrupt evaluation if the route
matches, regardless if other less-specific routes also match.

Enabling `strict` on a route will make the path matcher to be picky about trailing slashes.

## API

#### `evaluate`

#### `navigate`

#### `registerRoutes`
