import { applyMiddleware, compose, createStore } from 'redux';

import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga'
import { reducer } from './app/reducer';
import { rootSagaLoop } from './app/sagas';

export const configureStore = () => {
    const middlewares = [];

    let composeEnhancers = compose;

    const sagaMiddleware = createSagaMiddleware();
    middlewares.push(sagaMiddleware);

    // debug extras
    if (process.env.NODE_ENV === 'development') {
        middlewares.push(createLogger());
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    }

    const store = createStore(
        reducer,
        composeEnhancers(applyMiddleware(...middlewares))
    );

    sagaMiddleware.run(rootSagaLoop);

    return store;
};
