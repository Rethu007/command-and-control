import * as actions from './actions';
import * as utils from '../utils';

import axios from 'axios';
import { store } from '..';

const loginRequiredInterceptor = [
    response => response,
    error => {
        if (error?.config?.url !== '/auth' && error?.response?.status === 401)
            store.dispatch(actions.setLoginData(null));
        return Promise.reject(error);
    }
];

export const api = axios.create({
    baseURL: utils.getCommandControlBackendUrl(),
});

export const wApi = axios.create({
    baseURL: utils.getWorkflowRegistryUrl()
});

export const pApi = axios.create({
    baseURL: utils.getPackageRegistryUrl()
});

api.interceptors.response.use(...loginRequiredInterceptor);
wApi.interceptors.response.use(...loginRequiredInterceptor);
pApi.interceptors.response.use(...loginRequiredInterceptor);

export const updateAuth = (username, password) => {
    const apis = [api, wApi, pApi];
    apis.forEach(ax => {
        ax.defaults.auth = {
            username,
            password,
        };
    });
};
