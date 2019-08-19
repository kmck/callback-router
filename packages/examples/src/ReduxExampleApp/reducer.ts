import { AppActionTypes } from './actions';

export interface AppState {
  actionCount: number,
  instrument: string,
  color: string,
}

export const initialState: AppState = {
  actionCount: 0,
  color: 'gold',
  instrument: 'trumpet',
};

export function reducer(state = initialState, action: AppActionTypes) {
  switch (action.type) {
    case 'SET_INSTRUMENT':
      return {
        ...state,
        color: action.color,
        instrument: action.instrument,
      };
    case 'SET_COLOR':
      return {
        ...state,
        color: action.color,
      };
    default:
      return state;
  }
}
