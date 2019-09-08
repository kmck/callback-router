import {
  Action,
  Dispatch,
} from 'redux';

import {
  EvaluateRoutes,
  NavigateOptions,
  RouteChangeType,
  RoutePathParams,
} from 'callback-router';

export type DispatchRouteActionCreator<S, A extends Action<any>> = (
  params: RoutePathParams,
  type: RouteChangeType,
  pathname: string,
  state: any,
  path: string,
  getState: () => S,
) => A;

export type DispatchRouteCallback<S, A extends Action<any>> = (
  params: RoutePathParams,
  type: RouteChangeType,
  dispatch: Dispatch<A>,
  getState: () => S,
  pathname: string,
  state: any,
  path: string,
) => any;

export type DispatchRouteDefinition<S, A extends Action<any>> = {
  action: A | DispatchRouteActionCreator<S, A>,
  exact?: boolean,
  last?: boolean,
  navigate?: boolean,
  strict?: boolean,
} | {
  callback: DispatchRouteCallback<S, A>,
  exact?: boolean,
  last?: boolean,
  navigate?: boolean,
  strict?: boolean,
};

export type DispatchRouteMap<S, A extends Action<any>> = {
  [path: string]: A | DispatchRouteActionCreator<S, A> | DispatchRouteDefinition<S, A>,
};

export type NavigatePathTuple = [string, NavigateOptions?];

export type MapStateToPath<S, A extends Action<any>> = (
  state: S,
  action: A,
  prevState?: S,
) => NavigatePathTuple | string | null | undefined;

export {
  EvaluateRoutes,
  NavigateOptions,
  RouteChangeType,
  RoutePathParams,
};
