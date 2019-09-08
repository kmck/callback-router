import {
  Action,
  AnyAction,
  Dispatch,
  Reducer,
} from 'redux';

import {
  RouteCallback,
  RouteMap,

  evaluate,
  navigate,
  registerRoutes as baseRegisterRoutes,
} from 'callback-router';

import {
  DispatchRouteActionCreator,
  DispatchRouteMap,
  MapStateToPath,
} from './types';

export function registerRoutes<S, A extends Action<any> = AnyAction>(
  dispatchRoutes: DispatchRouteMap<S, A>,
  dispatch: Dispatch<A>,
  getState: () => S,
  callback?: (result: any) => void,
) {
  const createCallback = (action: A | DispatchRouteActionCreator<S, A>) => (
    (params, type, pathname, state, path) =>
      dispatch(typeof action === 'function' ? action(params, type, pathname, state, path, getState) : action)
  ) as RouteCallback;

  const routes: RouteMap = {};
  Object.entries(dispatchRoutes)
    .forEach(([key, value]) => {
      if (typeof value === 'function') {
        // Action creator
        routes[key] = createCallback(value);
      } else if ('type' in value) {
        // Redux action
        routes[key] = () => dispatch(value);
      } else if ('callback' in value) {
        // Normal route definition, NOT a Redux action
        const { callback, ...routeDefinition } = value;
        routes[key] = {
          callback: (params, type, pathname, state, path) => callback(params, type, dispatch, getState, pathname, state, path),
          ...routeDefinition,
        };
      } else {
        // Route definition with a Redux action or action creator
        const { action, ...routeDefinition } = value;
        routes[key] = {
          callback: createCallback(action),
          ...routeDefinition,
        };
      }
    });

  return baseRegisterRoutes(routes, callback);
}

export function createCallbackRouterReducer<S, A extends Action<any> = AnyAction>(
  reducer: Reducer<S, A>,
  mapStateToPath: MapStateToPath<S, A>,
  navigateInitialState = false,
) {
  return function wrappedReducer(prevState, action) {
    const prevPath = window.location.pathname;
    const nextState = reducer(prevState, action);
    const pathResult = mapStateToPath(nextState, action, prevState);
    if (pathResult) {
      const [nextPath, options] = typeof pathResult === 'string'
        ? [pathResult]
        : pathResult;
      if ((navigateInitialState || prevState) && nextPath && nextPath !== prevPath) {
        navigate(nextPath, options);
      }
    }
    return nextState;
  } as typeof reducer;
}

export {
  evaluate,
  navigate,
};
