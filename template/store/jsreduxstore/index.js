import { createStore, applyMiddleware } from 'redux'
import Thunk from 'redux-promise'
import reducers from './actions'

const store = applyMiddleware(Thunk)(createStore)

export default store(reducers)