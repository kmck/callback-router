import {
  ProcessedRouteMapEntry,
  Route,
  RouteChangeType,
  RouteMap,
} from './types';
import {
  ROUTE_CHANGE_FORCE_PUSH_STATE,
  ROUTE_CHANGE_FORCE_REPLACE_STATE,
  ROUTE_CHANGE_POP_STATE,
  ROUTE_CHANGE_PUSH_STATE,
  ROUTE_CHANGE_REPLACE_STATE,
  ROUTE_CHANGE_UNKNOWN,
} from './constants';
import {
  compareRoutes,
  getMatchingRoutes,
  processRoutes,
} from './utils';

const routeMaps = new Set<ProcessedRouteMapEntry>();
let globalRoutes: Route[] = [];

function resolveGlobalRoutes() {
  globalRoutes.length = 0;
  routeMaps.forEach(([routes]) => {
    globalRoutes.push(...routes);
  });
  globalRoutes.sort(compareRoutes);
}

let isSubscribed = false;

export function evaluate(
  pathname: string = document.location.pathname,
  state: any = window.history.state,
  type: RouteChangeType = ROUTE_CHANGE_UNKNOWN,
  routes: Route[] = globalRoutes,
) {
  const matches = getMatchingRoutes(pathname, routes, type);
  if (!matches) {
    return undefined;
  }
  const results = matches.map(match => match.callback(
    match.params,
    type,
    pathname,
    state,
    match.path,
  ));
  // We're only returning the first result. Could this be better? Maybe!
  return results[0];
}

export function navigate(path: string, {
  force = false,
  replaceState = false,
  state = {},
  title = document.title,
} = {}) {
  let type: RouteChangeType;
  if (replaceState) {
    type = force ? ROUTE_CHANGE_FORCE_REPLACE_STATE : ROUTE_CHANGE_REPLACE_STATE;
    window.history.replaceState(state, title, path);
  } else {
    type = force ? ROUTE_CHANGE_FORCE_PUSH_STATE : ROUTE_CHANGE_PUSH_STATE;
    window.history.pushState(state, title, path);
  }
  return evaluate(document.location.pathname, state, type, globalRoutes);
}

function handlePopState(event: PopStateEvent) {
  evaluate(document.location.pathname, event.state, ROUTE_CHANGE_POP_STATE, globalRoutes);
}

export function registerRoutes(
  routes: RouteMap,
  callback?: (result: any) => void,
) {
  const processedRoutes = processRoutes(routes, callback);
  const routeMapEntry = [processedRoutes, callback] as ProcessedRouteMapEntry;
  routeMaps.add(routeMapEntry);
  globalRoutes.push(...processedRoutes);
  globalRoutes.sort(compareRoutes);

  if (!isSubscribed) {
    window.addEventListener('popstate', handlePopState);
    isSubscribed = true;
  }

  function evaluateRoutes(
    pathname = document.location.pathname,
    state: any = window.history.state,
    type: RouteChangeType,
  ) {
    return evaluate(pathname, state, type, processedRoutes);
  }

  function unregisterRoutes() {
    routeMaps.delete(routeMapEntry);
    resolveGlobalRoutes();

    if (!routeMaps.size) {
      window.removeEventListener('popstate', handlePopState);
      isSubscribed = false;
    }
  }

  return {
    unregisterRoutes,
    evaluate: evaluateRoutes,
  };
}
