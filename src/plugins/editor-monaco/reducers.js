import { fromJS, List } from 'immutable';

import { EDITOR_SET_THEME } from './actions/set-theme.js';
import { EDITOR_SET_MARKERS } from './actions/set-markers.js';
import { EDITOR_CLEAR_MARKERS } from './actions/clear-markers.js';
import { EDITOR_APPEND_MARKERS } from './actions/append-markers.js';
import { EDITOR_SET_LANGUAGE } from './actions/set-language.js';

const reducers = {
  [EDITOR_SET_THEME]: (state, action) => {
    return state.set('theme', action.payload);
  },
  [EDITOR_SET_MARKERS]: (state, action) => {
    return state.set('markers', fromJS(action.payload));
  },
  [EDITOR_APPEND_MARKERS]: (state, action) => {
    const markers = state.get('markers', List());
    return state.set('markers', markers.concat(fromJS(action.payload)));
  },
  [EDITOR_CLEAR_MARKERS]: (state, action) => {
    const { payload: source } = action;
    const markers = state
      .get('markers', List())
      .filterNot((marker) => marker.get('source') === source);
    return state.set('markers', markers);
  },
  [EDITOR_SET_LANGUAGE]: (state, action) => {
    return state.set('language', action.payload);
  },
};

export default reducers;
