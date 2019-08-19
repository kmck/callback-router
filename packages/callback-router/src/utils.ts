import pathToRegexp from 'path-to-regexp';

import {
  Route,
  RouteCallback,
  RouteChangeType,
  RouteMap,
  RouteMatch,
} from './types';
import { ROUTE_CHANGE_PUSH_STATE, ROUTE_CHANGE_REPLACE_STATE } from './constants';

const REGEX_SEGMENT_PARAM = /^:/;
const REGEX_SEGMENT_OPTIONAL = /\?$/;

export function compareRoutes([routeA]: Route, [routeB]: Route) {
  const routePartsA = routeA.split('/');
  const routePartsB = routeB.split('/');

  const routePartsLengthA = routePartsA.length;
  const routePartsLengthB = routePartsB.length;

  // Prioritize path with most segments
  if (routePartsLengthA > routePartsLengthB) {
    return -1;
  } else if (routePartsLengthA < routePartsLengthB) {
    return 1;
  }

  // Compare each path segment in order
  const minLength = Math.min(routePartsLengthA, routePartsLengthB);
  for (let i = 1; i < minLength; i += 1) {
    const routePartA = routePartsA[i];
    const routePartB = routePartsB[i];

    // Skip matching parts
    if (routePartA === routePartB) {
      continue;
    }

    // Prioritize non-param
    const isParamA = REGEX_SEGMENT_PARAM.test(routePartA);
    const isParamB = REGEX_SEGMENT_PARAM.test(routePartB);
    if (!isParamA && isParamB) {
      return -1;
    } else if (isParamA && !isParamB) {
      return 1;
    } else if (isParamA && isParamB) {
      // Prioritize required param
      const isOptionalA = REGEX_SEGMENT_OPTIONAL.test(routePartA);
      const isOptionalB = REGEX_SEGMENT_OPTIONAL.test(routePartB);
      if (!isOptionalA && isOptionalB) {
        return -1;
      } else if (isOptionalA && !isOptionalB) {
        return 1;
      }
      continue;
    }

    // Wildcard routes
    const wildcardIndexA = routePartA.indexOf('*');
    const wildcardIndexB = routePartB.indexOf('*');
    if (wildcardIndexA < 0 && wildcardIndexB >= 0) {
      return -1;
    } else if (wildcardIndexB < 0 && wildcardIndexA >= 0) {
      return 1;
    } else if (wildcardIndexA > wildcardIndexB) {
      return -1;
    } else if (wildcardIndexA < wildcardIndexB) {
      return 1;
    }

    // Alphabetize
    if (routePartA < routePartB) {
      return -1;
    } else if (routePartA > routePartB) {
      return 1;
    }
  }

  return 0;
}

export function processRoutes(
  routeMap: RouteMap,
  callback?: (result: any) => void
) {
  return Object.entries(routeMap)
    .map(([path, routeConfig]) => {
      const {
        callback: routeCallback,
        exact = false,
        last = true,
        navigate = false,
        strict = false,
      } = typeof routeConfig === 'function'
        ? { callback: routeConfig }
        : routeConfig;

      const options = {
        end: exact,
        sensitive: false,
        strict,
      };

      const keys: pathToRegexp.Key[] = [];
      const regexp = pathToRegexp(path, keys, options);
      const paramNames = keys.map(({ name }) => name);

      function matchRoute(pathname: string) {
        const match = regexp.exec(pathname);

        if (!match) {
          return null;
        }

        const [url, ...values] = match;
        const isExact = pathname === url;

        if (exact && !isExact) {
          return null;
        }

        const params: { [k: string]: string } = {};

        paramNames.forEach((key, i) => {
          params[key] = values[i];
        });

        return {
          callback: ((...args) => {
            let result = routeCallback(...args);
            if (callback) {
              result = callback(result);
            }
            return result;
          }) as RouteCallback,
          isExact,
          params,
          path,
          url: path === '/' && url === '' ? '/' : url,
        };
      };

      return [path, matchRoute, navigate, last] as Route;
    })
    .sort(compareRoutes);
}

export function getMatchingRoutes(
  pathname: string = document.location.pathname,
  routes: Route[],
  type?: RouteChangeType,
) {
  const matches = ([] as RouteMatch[]);
  routes.some(([_path, matchRoute, navigate, last], _i) => {
    // Ignore non-navigation routes on imperative URL changes
    if (!navigate) {
      switch (type) {
        case ROUTE_CHANGE_PUSH_STATE:
        case ROUTE_CHANGE_REPLACE_STATE:
          return false;
        default:
          break;
      }
    }

    // Evaluate the pathname and determine if we have a match
    const match = matchRoute(pathname);
    if (match) {
      matches.push(match);
      // Stop if this is a last match
      if (last) {
        return true;
      }
    }

    return false;
  });
  return matches;
}
