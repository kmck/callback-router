import React, {
  useCallback,
  useMemo,
} from 'react';

import {
  RouteCallback,
  useCallbackRouter,
} from 'react-use-callback-router';

interface AppProps {
  className?: string,
};

const defaultCallback: RouteCallback = (params, type, pathname, state, path) => {
  console.log('route', path);
  console.log(type, pathname, params);
  // console.log('state', state);
  return { params, type, pathname, state, path };
};

const App: React.FC<AppProps> = ({
  className,
}) => {
  const routes = useMemo(() => ({
    '/one': {
      callback: defaultCallback,
    },
    '/one/:option?': {
      callback: defaultCallback,
    },
    '/one/two': {
      callback: defaultCallback,
    },
    '/three': {
      callback: defaultCallback,
    },
    '/*': {
      callback: defaultCallback,
    },
  }), []);
  const [result, navigate, evaluate] = useCallbackRouter(routes, true);

  const handleNavigateOneClick = useCallback((e: React.MouseEvent) => {
    navigate('/one', { replaceState: e.altKey, force: e.shiftKey });
  }, [navigate]);

  const handleNavigateTwoClick = useCallback((e: React.MouseEvent) => {
    navigate('/one/two', { replaceState: e.altKey, force: e.shiftKey });
  }, [navigate]);

  const handleNavigateThreeClick = useCallback((e: React.MouseEvent) => {
    navigate('/three', { replaceState: e.altKey, force: e.shiftKey });
  }, [navigate]);

  return (
    <div className={className}>
      <h3>Result</h3>
      <pre><code>{JSON.stringify(result, null, 2)}</code></pre>
      <p><button onClick={handleNavigateOneClick}>One</button></p>
      <p><button onClick={handleNavigateTwoClick}>Two</button></p>
      <p><button onClick={handleNavigateThreeClick}>Three</button></p>
    </div>
  );
};

export default App;
