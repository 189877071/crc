import { createStore, applyMiddleware, combineReducers } from 'redux'
import PromiseMiddleware from 'redux-promise'
import { helloworld } from './reducers'

export default () => createStore(combineReducers({
  helloworld
}), applyMiddleware(PromiseMiddleware))