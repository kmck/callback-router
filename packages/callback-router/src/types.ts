import {
  ROUTE_CHANGE_FORCE_PUSH_STATE,
  ROUTE_CHANGE_FORCE_REPLACE_STATE,
  ROUTE_CHANGE_INITIALIZE,
  ROUTE_CHANGE_POP_STATE,
  ROUTE_CHANGE_PUSH_STATE,
  ROUTE_CHANGE_REPLACE_STATE,
  ROUTE_CHANGE_UNKNOWN,
} from './constants';

export type RouteChangeType = (
  typeof ROUTE_CHANGE_FORCE_PUSH_STATE
  | typeof ROUTE_CHANGE_FORCE_REPLACE_STATE
  | typeof ROUTE_CHANGE_INITIALIZE
  | typeof ROUTE_CHANGE_POP_STATE
  | typeof ROUTE_CHANGE_PUSH_STATE
  | typeof ROUTE_CHANGE_REPLACE_STATE
  | typeof ROUTE_CHANGE_UNKNOWN
);

export type RoutePathParams = { [param: string]: string | undefined };

export type RouteCallback = (
  params: RoutePathParams,
  type: RouteChangeType,
  pathname: string,
  state: any,
  path: string,
) => any;

export type RouteDefinition = {
  callback: RouteCallback,
  exact?: boolean,
  last?: boolean,
  navigate?: boolean,
  strict?: boolean,
};

export type RouteMap = {
  [path: string]: RouteCallback | RouteDefinition,
};

export type RouteMatch = {
  callback: RouteCallback,
  isExact: boolean,
  params: RoutePathParams,
  path: string,
  url: string,
};

export type RouteMatcher = (pathname: string) => null | RouteMatch;

export type Route = [string, RouteMatcher, boolean, boolean];

export type ProcessedRouteMapEntry = [Route[], (result: any) => void];

export type EvaluateRoutes = (pathname: string, state: any, type: RouteChangeType) => any;

export type NavigateOptions = {
  force?: boolean,
  replaceState?: boolean,
  state?: any,
  title?: string,
};
