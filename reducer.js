import { combineReducers } from 'redux';

const INITIAL_STATE = {
    test: false
};

const testReducer =  (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SUCCESS_ACTION":
            return {test: true};
        default:
            return state;
    }
};

export default combineReducers({testReducer});

export const failAction = () => {
    return {
        type: "REQUEST_FAIL",
        payload: null,
    };
};

export const testAction = () => {
    return {
        type: "TEST_ACTION",
        payload: null,
    };
};

export const successAction = () => {
    return {
        type: "SUCCESS_ACTION",
        payload: null,
    };
};
