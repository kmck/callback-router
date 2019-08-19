import React, {
  useCallback,
  useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  DispatchRouteMap,
  useReduxCallbackRouter,
} from 'react-use-redux-callback-router';

import { AppActionTypes } from './actions';
import { AppState } from './reducer';

interface AppProps {
  className?: string,
};

const App: React.FC<AppProps> = ({
  className,
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state: AppState) => state);

  const routes: DispatchRouteMap<AppState, AppActionTypes> = useMemo(() => ({
    // '/colors/:color': ({ color }) => ({
    //   color: color as string,
    //   type: 'SET_COLOR',
    // }),
    // '/keith': () => ({
    //   color: 'white',
    //   instrument: 'bass',
    //   type: 'SET_INSTRUMENT',
    // }),
    // '/colin': () => ({
    //   color: 'red',
    //   instrument: 'guitar',
    //   type: 'SET_INSTRUMENT',
    // }),
    // '/:instrument/:color': {
    //   callback(params: { instrument?: string, color?: string }, _type, dispatch, getState) {
    //     console.log('params', params);
    //     console.log('state', getState());
    //     if (params.instrument && params.color) {
    //       dispatch({
    //         instrument: params.instrument,
    //         color: params.color,
    //         type: 'SET_INSTRUMENT',
    //       });
    //     }
    //   },
    // },
    '/(.*)': {
      callback(params, type, dispatch, getState, pathname, state, path) {
        console.log('route', path);
        console.log(type, pathname, params);
        console.log('state', state, getState());
        dispatch({
          payload: params,
          type: 'DO_NOTHING',
        })
      },
    },
  }), []);
  useReduxCallbackRouter(routes, true);

  const handleInstrumentClick = useCallback(() => {
    dispatch({
      color: 'orange',
      instrument: 'guitar',
      navigate: true,
      type: 'SET_INSTRUMENT',
    });
  }, [dispatch]);

  const handleColorClick = useCallback(() => {
    dispatch({
      color: 'blue',
      navigate: true,
      type: 'SET_COLOR',
    });
  }, [dispatch]);

  return (
    <div className={className}>
      <h3>App State</h3>
      <pre><code>{JSON.stringify(state, null, 2)}</code></pre>
      <p><button onClick={handleInstrumentClick}>Instrument</button></p>
      <p><button onClick={handleColorClick}>Color</button></p>
    </div>
  );
};

export default App;
