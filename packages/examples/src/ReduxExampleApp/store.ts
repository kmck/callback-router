import { createStore } from 'redux';

import {
  NavigatePathTuple,
  createCallbackRouterReducer,
} from 'redux-callback-router';

import { AppActionTypes } from './actions';
import { AppState, reducer } from './reducer';

function mapStateToPath(
  state: AppState,
  action: AppActionTypes,
): NavigatePathTuple | undefined {
  if (action.navigate) {
    return [`/${state.instrument}/${state.color}`, {
      force: action.force,
      replaceState: action.replaceState,
    }];
  }
}

const __REDUX_DEVTOOLS_EXTENSION__ = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

export default createStore(
  createCallbackRouterReducer(reducer, mapStateToPath),
  __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__(),
);
