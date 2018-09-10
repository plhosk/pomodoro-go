import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore } from 'redux-persist'

import { rootReducer, rootSaga } from './reducer'

const sagaMiddleware = createSagaMiddleware()
let storeEnhancers = applyMiddleware(
  sagaMiddleware,
)

// add the redux dev tools
if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
  storeEnhancers = compose(storeEnhancers, window.devToolsExtension())
}

const store = createStore(rootReducer, undefined, storeEnhancers)
const persistor = persistStore(store)

let sagaTask = sagaMiddleware.run(rootSaga)


// Hot Module Replacement API
// needed for hot-reloading sagas and redux store
if (module.hot) {
  module.hot.accept('./reducer', () => {
    store.replaceReducer(rootReducer)
    sagaTask.cancel()
    sagaTask = sagaMiddleware.run(rootSaga)
  })
}

export { store, persistor }
