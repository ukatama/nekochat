import { Map } from 'immutable';
import { handleActions } from 'redux-actions';
import { GET } from '../actions/character';

export default handleActions({
    [GET]: (state, { payload }) => state.set(payload.url, payload.data),
}, new Map());
