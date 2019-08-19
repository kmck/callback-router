export interface SetInstrumentAction {
  color: string,
  instrument: string,
  navigate?: boolean,
  type: 'SET_INSTRUMENT',
}

export interface SetColorAction {
  color: string,
  navigate?: boolean,
  type: 'SET_COLOR',
}

export interface DoNothingAction {
  payload?: any,
  navigate?: boolean,
  type: 'DO_NOTHING',
}

export type AppActionTypes = SetInstrumentAction | SetColorAction | DoNothingAction;
