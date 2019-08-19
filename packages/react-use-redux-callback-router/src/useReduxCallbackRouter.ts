import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Action,
  AnyAction,
} from 'redux';
import { useStore } from 'react-redux';

import {
  DispatchRouteMap,
  ROUTE_CHANGE_INITIALIZE,
  evaluate,
  registerRoutes,
  navigate,
} from 'redux-callback-router';

export default function useCallbackRouter<S, A extends Action<any> = AnyAction>(
  routes: DispatchRouteMap<S, A>,
  initialize = true,
): [any, typeof navigate, typeof evaluate] {
  const store = useStore<S, A>();
  const initializedRef = useRef(!initialize);
  const [result, setResult] = useState<any>(null);

  const handleEvaluateRoute = useCallback((evaluateResult) => {
    setResult(evaluateResult);
    return evaluateResult;
  }, []);

  useLayoutEffect(() => {
    const {
      unregisterRoutes,
      evaluate: evaluateLocal,
    } = registerRoutes(routes, store.dispatch, store.getState, handleEvaluateRoute);

    if (!initializedRef.current) {
      initializedRef.current = true;
      const evaluateResult = evaluateLocal(
        document.location.pathname,
        window.history.state,
        ROUTE_CHANGE_INITIALIZE,
      );
      setResult(evaluateResult);
    }

    return () => {
      unregisterRoutes();
    };
  }, [store.getState, store.dispatch, routes, handleEvaluateRoute]);

  return [result, navigate, evaluate];
}
