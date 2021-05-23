import * as types from './action-types';

export const setConfigDrawerVisible = (configDrawerVisible) =>
    ({ type: types.SET_CONFIGDRAWER_VISIBLE, payload: configDrawerVisible });

export const setConfigEditorVisible = (configEditorVisible) =>
    ({ type: types.SET_CONFIGEDITOR_VISIBLE, payload: configEditorVisible });

export const setWorkflowCustomizerVisible = (workflowCustomizerVisible) =>
    ({ type: types.SET_WORKFLOWCUSTOMIZER_VISIBLE, payload: workflowCustomizerVisible });

export const setDevices = (devices) =>
    ({ type: types.SET_DEVICES, payload: devices });

export const setHWID = (hwid) =>
    ({ type: types.SET_HWID, payload: hwid });

export const setCurrMenu = (key) =>
    ({ type: types.SET_CURR_MENU, payload: key });

export const setLoginData = loginData =>
    ({ type: types.SET_LOGIN_DATA, payload: loginData });
