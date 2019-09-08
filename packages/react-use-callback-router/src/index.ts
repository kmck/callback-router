import {
  navigate,
  evaluate,
} from 'callback-router';

export {
  ROUTE_CHANGE_FORCE_PUSH_STATE,
  ROUTE_CHANGE_FORCE_REPLACE_STATE,
  ROUTE_CHANGE_INITIALIZE,
  ROUTE_CHANGE_POP_STATE,
  ROUTE_CHANGE_PUSH_STATE,
  ROUTE_CHANGE_REPLACE_STATE,
  ROUTE_CHANGE_UNKNOWN,
  EvaluateRoutes,
  NavigateOptions,
  ProcessedRouteMapEntry,
  Route,
  RouteCallback,
  RouteChangeType,
  RouteDefinition,
  RouteMap,
  RouteMatch,
  RouteMatcher,
  RoutePathParams,
} from 'callback-router';

export { default as useCallbackRouter } from './useCallbackRouter';

export function useNavigate() {
  return navigate;
}

export function useEvalute() {
  return evaluate;
}
