export interface BaseAction {
  force?: boolean,
  navigate?: boolean,
  replaceState?: boolean,
  type: string,
};

export interface SetInstrumentAction extends BaseAction {
  color: string,
  instrument: string,
  type: 'SET_INSTRUMENT',
}

export interface SetColorAction extends BaseAction {
  color: string,
  type: 'SET_COLOR',
}

export interface DoNothingAction extends BaseAction {
  payload?: any,
  type: 'DO_NOTHING',
}

export type AppActionTypes = SetInstrumentAction | SetColorAction | DoNothingAction;
