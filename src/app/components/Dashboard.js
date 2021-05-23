import './ui.css';
import 'moment/locale/de';

import * as selectors from '../selectors';

import { ConfigDrawer } from './ConfigDrawer';
import { Layout } from 'antd';
import React from 'react';
import { Sidebar } from './Sidebar';
import { WorkflowCustomizer } from './WorkflowCustomizer';
import moment from 'moment';
import { sidebarEntries } from '../sidebarEntries';
import { useSelector } from 'react-redux';

moment.locale('de');

const sidebarWidth = 280;


export const Dashboard = () => {

    const currentMenu = useSelector(selectors.gettCurrMenu)

    return (
        <Layout style={{ minHeight: '100vh' }}>

            <ConfigDrawer />

            <WorkflowCustomizer />

            <Sidebar items={sidebarEntries} width={sidebarWidth} />

            <Layout key={currentMenu} className="site-layout" style={{ backgroundColor: 'white', paddingLeft: `${sidebarWidth}px` }}>

                {sidebarEntries.find(entry => entry.key === currentMenu).screen}

            </Layout>

        </Layout>
    );
};