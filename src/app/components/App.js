import * as selectors from '../selectors';

import { Dashboard } from './Dashboard';
import { LoginScreen } from './LoginScreen';
import React from 'react';
import { useSelector } from 'react-redux';

export const App = () => {
    const loginData = useSelector(selectors.getLoginData);

    if (!loginData)
        return (
            <LoginScreen />
        );

    return (
        <Dashboard />
    );
};
