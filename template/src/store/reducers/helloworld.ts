import { handleActions } from 'redux-actions'
import { HELLOWORLD } from '@/store/types'

const init = {
  text: 'Hello World'
}

export default handleActions({
  [HELLOWORLD](state, action: { payload: string }) {
    return { ...state, text: action.payload }
  }
}, init)