# useCallbackRouter

Provides a React hook for using [Callback Router].

## Install

[yarn][]:
```bash
yarn add react-use-callback-router
```

[npm][]:

```bash
npm install react-use-callback-router
```


## Usage

```js
import {
  useCallbackRouter,
  useNavigate,
} from 'react-use-callback-router';

const YourComponent = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const routes = useMemo(() => ({
    '/users': () => {
      setUserId(null);
      return null;
    },
    '/users/:id': {
      callback: (params) => {
        setUserId(params.id);
        return params.id;
      },
      last: true, // prevent '/users' route from firing
    },
  }), []);
  useCallbackRouter(routes, true);

  const handleFirstButtonClick = useCallback(() => {
    // Update the URL manually (callback is not invoked)
    setUserId(1);
    navigate('/users/1');
  }, [navigate]);

  const handleSecondButtonClick = useCallback(() => {
    // Let the router update state based on the path
    navigate('/users/:id', { force: true });
  }, [navigate]);

  return (
    <div>
      <button onClick={handleFirstButtonClick}>User 1</button>
      <button onClick={handleSecondButtonClick}>User 2</button>
    </div>
  );
};
```


## API

#### `useEvaluate`

Returns `evaluate` from [Callback Router].

#### `useNavigate`

Returns `navigate` from [Callback Router].

#### `useCallbackRouter`

Registers paths to their callbacks and returns the most recent result and the
`evaluate` function for the given routes.

```js
const [result, evaluate] = useCallbackRouter(routes, initialize);
```

#### Arguments

##### `routes` (`Object`)

Map of paths to route definitions or callbacks.
The path may contain named `:params` or `(.*)` wildcards.

##### `initialize` (`boolean`, defaults to `true`)

When set, the routes are evaluated on mount.

##### `callback(params, type, pathname, state, path)`

Function invoked when the route is matched.

#### Returns

##### `result`

The return value of the most recently evaluated callback for a matching route.

##### `evaluate` (`Function`)

Determines which routes match the pathname and invokes their callbacks.

**This does not evaluate all routes**, just the ones that were included when
calling the hook!


## License

ISC © [Keith McKnight](https://github.com/kmck)


[yarn]: https://yarnpkg.com/lang/en/docs/install
[npm]: https://docs.npmjs.com/cli/install
[Callback Router]: https://github.com/kmck/callback-router/tree/master/packages/callback-router
