import { createAction, handleActions } from 'redux-actions'
import { combineReducers } from 'redux'

const NAMEACTION = 'NAME'

export const setName = createAction(NAMEACTION)

export default combineReducers({
  a: handleActions({
    [NAMEACTION]: (state, action) => ({ ...state, name: action.payload })
  }, { name: 'Create React App' })
})

