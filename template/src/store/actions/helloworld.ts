import { createAction } from 'redux-actions'
import { HELLOWORLD } from '@/store/types'

export const setHelloWorld = createAction(HELLOWORLD, (data: string) => data)