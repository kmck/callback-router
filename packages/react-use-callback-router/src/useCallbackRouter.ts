import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  RouteMap,
  ROUTE_CHANGE_INITIALIZE,
  evaluate,
  registerRoutes,
  navigate,
} from 'callback-router';

export default function useCallbackRouter(
  routes: RouteMap,
  initialize = true,
): [any, typeof navigate, typeof evaluate] {
  const isInitializedRef = useRef(!initialize);
  const [result, setResult] = useState<any>(null);

  const handleEvaluateRoute = useCallback((evaluateResult) => {
    setResult(evaluateResult);
    return evaluateResult;
  }, []);

  useLayoutEffect(() => {
    const {
      unregisterRoutes,
      evaluate: evaluateLocal,
    } = registerRoutes(routes, handleEvaluateRoute);

    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
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
  }, [routes, handleEvaluateRoute]);

  return [result, navigate, evaluate];
}
