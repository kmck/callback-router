import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import {
  EvaluateRoutes,
  RouteMap,
  ROUTE_CHANGE_INITIALIZE,
  registerRoutes,
} from 'callback-router';

export default function useCallbackRouter(
  routes: RouteMap,
  initialize = true,
): [any, EvaluateRoutes] {
  const isInitializedRef = useRef(!initialize);
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
    } = registerRoutes(routes, handleEvaluateRoute);

    evaluateLocalRef.current = evaluateLocal;

    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      evaluate(
        document.location.pathname,
        window.history.state,
        ROUTE_CHANGE_INITIALIZE,
      );
    }

    return () => {
      unregisterRoutes();
    };
  }, [routes, handleEvaluateRoute]);

  return [result, evaluate];
}
