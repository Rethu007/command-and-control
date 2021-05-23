import * as types from './action-types';

const initialState = {
    configDrawerVisible: false,
    configEditorVisible: false,
    workflowCustomizerVisible: false,
    key: "1",
    loginData: null,
};


export const reducer = (state = initialState, action) => {
    switch (action.type) {

        case types.SET_CONFIGDRAWER_VISIBLE: {
            return {
                ...state,
                configDrawerVisible: action.payload,
            };
        }

        case types.SET_CONFIGEDITOR_VISIBLE: {
            return {
                ...state,
                configEditorVisible: action.payload,
            };
        }

        case types.SET_WORKFLOWCUSTOMIZER_VISIBLE: {
            return {
                ...state,
                workflowCustomizerVisible: action.payload,
            };
        }

        case types.SET_DEVICES: {
            return {
                ...state,
                devices: action.payload,
            };
        }

        case types.SET_HWID: {
            return {
                ...state,
                hwid: action.payload,
            };
        }

        case types.SET_CURR_MENU: {
            return {
                ...state,
                key: action.payload,
            };
        }

        case types.SET_LOGIN_DATA: {
            return {
                ...state,
                loginData: action.payload,
            };
        }


        default:
            return state;
    }
};