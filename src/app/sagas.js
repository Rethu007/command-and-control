import { call } from 'redux-saga/effects';

function rootSaga() {
}

export function* rootSagaLoop() {
    while (true) {
        try {
            yield call(rootSaga);
            break;
        } catch (err) {
            console.error(err);
        }
    }
}