import { createActionTypesForModule } from "../redux-utils";

export const {
    SET_CONFIGDRAWER_VISIBLE,
    SET_WORKFLOWCUSTOMIZER_VISIBLE,
    SET_CONFIGEDITOR_VISIBLE,
    SET_DEVICES,
    SET_HWID,
    SET_CURR_MENU,
    SET_LOGIN_DATA,
} = createActionTypesForModule('app');