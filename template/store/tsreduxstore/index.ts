import { createStore, applyMiddleware } from 'redux'
import Thunk from 'redux-promise'
import actions from './actions'
const store = applyMiddleware(Thunk)(createStore)

export default store(actions)