import {call, put, takeLatest} from 'redux-saga/effects';
import reducer, {failAction, successAction, testAction} from "../reducer";
import SagaTester from 'redux-saga-tester';

const retryDelay = process.env.NODE_ENV === 'test' ? 1 : 2000;
const maxRetries = 5;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function* retryWrapper(apiCall) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(i);
            return yield apiCall;
        } catch (err) {
            if (i < maxRetries-1) {
                yield call(delay, retryDelay);
            } else {
                throw err;
            }
        }
    }
    throw new Error('Can not reach api');
}

function* startSaga() {
    yield takeLatest("TEST_ACTION", testSaga);
}

function* testSaga(action) {
    try {
        const result = yield call(
            retryWrapper,
            fetch('http://google.de')
        );
        console.log(result.body);
        yield put(successAction())
    } catch (err) {
        yield put(failAction())
    }
}

describe('address sags', () => {
    let sagaTester = null;
    beforeEach(() => {
        sagaTester = new SagaTester({
            reducers: reducer,
        });
        sagaTester.start(startSaga);
        sagaTester.reset(true);
        fetch.resetMocks();
    });

    it('Should increase the call counter', async () => {
        fetch
            .mockReject(new Error('rejected'));
        await sagaTester.dispatch(testAction());
        await sagaTester.waitFor('REQUEST_FAIL');
        expect(fetch.mock.calls.length).toEqual(5);
    });
});
