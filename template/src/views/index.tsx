import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route } from 'react-router-dom'
import store from '@/store'
import Home from '@/views/Home'

export default class App extends PureComponent {
  render() {
    return (
      <Provider store={store()}>
        <BrowserRouter>
          <Route path="/" component={Home} />
        </BrowserRouter>
      </Provider>
    )
  } 
}