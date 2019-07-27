import { createAction, handleActions } from 'redux-actions'
import { combineReducers } from 'redux'

const NAMEACTION = 'NAME'

export const setName = createAction<string>(NAMEACTION)

interface IA {
  name: string;
}

export default combineReducers({
  a: handleActions<IA>({
    [NAMEACTION]: (state, action: any) => ({ ...state, name: action.payload })
  }, { name: 'Create React App' })
})