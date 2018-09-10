import { combineReducers } from 'redux'
import { all } from 'redux-saga/effects'

import { timerReducer } from './timerDuck'

const rootReducer = combineReducers({
  timer: timerReducer,
})

// const rootReducer = (state, action) => {
//   if (action.type === 'RESET_STORE') {
//     state = undefined // eslint-disable-line no-param-reassign
//   }
//   return appReducer(state, action)
// }

/**
 * Initialize sagas
 */

// // Log every redux action
// function* logActions() {
//   if (process.env.NODE_ENV === 'production') {
//     return
//   }
//   while (true) { // eslint-disable-line no-constant-condition
//     const action = yield take()
//     const state = yield select()
//     console.err(action.type, 'action:', action, 'state:', state) // eslint-disable-line no-console
//   }
// }

function* rootSaga() {
  yield all([
    // logActions(),
    // timerSagas(),
  ])
}

export { rootReducer, rootSaga }
