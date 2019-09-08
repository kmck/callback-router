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
  EvaluateRoutes,
  DispatchRouteMap,
  ROUTE_CHANGE_INITIALIZE,
  registerRoutes,
} from 'redux-callback-router';

export default function useCallbackRouter<S, A extends Action<any> = AnyAction>(
  routes: DispatchRouteMap<S, A>,
  initialize = true,
): [any, EvaluateRoutes] {
  const store = useStore<S, A>();
  const initializedRef = useRef(!initialize);
  const [result, setResult] = useState<any>(null);
  const evaluateLocalRef = useRef<EvaluateRoutes>();

  const evaluate = useCallback<EvaluateRoutes>((...args) => {
    if (evaluateLocalRef.current) {
      return evaluateLocalRef.current(...args);
    }
  }, []);

  const handleEvaluateRoute = useCallback((evaluateResult) => {
    setResult(evaluateResult);
    return evaluateResult;
  }, []);

  useLayoutEffect(() => {
    const {
      unregisterRoutes,
      evaluate: evaluateLocal,
    } = registerRoutes(routes, store.dispatch, store.getState, handleEvaluateRoute);

    evaluateLocalRef.current = evaluateLocal;

    if (!initializedRef.current) {
      initializedRef.current = true;
      evaluateLocal(
        document.location.pathname,
        window.history.state,
        ROUTE_CHANGE_INITIALIZE,
      );
    }

    return () => {
      unregisterRoutes();
    };
  }, [store.getState, store.dispatch, routes, handleEvaluateRoute]);

  return [result, evaluate];
}
