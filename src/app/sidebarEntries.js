import { AimOutlined, BookOutlined, BranchesOutlined, FormOutlined, QrcodeOutlined, UserOutlined } from '@ant-design/icons';

import { DefaultConfigScreen } from './components/DefaultConfigScreen';
import { DevicesScreen } from './components/DevicesScreen';
import { LoginQrcodeGeneratorScreen } from './components/LoginQrcodeGeneratorScreen';
import { PatientQrcodeGeneratorScreen } from './components/PatientQrcodeGeneratorScreen';
import React from 'react';
import { SetupQrcodeGeneratorScreen } from './components/SetupQrcodeGeneratorScreen';
import { UserManagementScreen } from './components/UserManagementScreen';
import { WorkflowsScreen } from './components/WorkflowsScreen';
import { KaldiModelsScreen } from './components/KaldiModelsScreen';

export const sidebarEntries = [
    {
        name: 'Geräte',
        key: '1',
        icon: <AimOutlined />,
        screen: <DevicesScreen />,
    },
    {
        name: 'Standardkonfiguration',
        key: '2',
        icon: <FormOutlined />,
        screen: <DefaultConfigScreen />,
    },
    {
        name: 'Workflows',
        key: '3',
        icon: <BranchesOutlined />,
        screen: <WorkflowsScreen />,
    },
    {
        name: 'Kaldi-Modelle',
        key: '8',
        icon: <BookOutlined />,
        screen: <KaldiModelsScreen />,
    },
    {
        name: 'Nutzerverwaltung',
        key: '6',
        icon: <UserOutlined />,
        screen: <UserManagementScreen />,
    },
    {
        name: 'Anmelde QR Code Generator',
        key: '4',
        icon: <QrcodeOutlined />,
        screen: <LoginQrcodeGeneratorScreen />,
    },
    {
        name: 'Patienten QR Code Generator',
        key: '5',
        icon: <QrcodeOutlined />,
        screen: <PatientQrcodeGeneratorScreen />,
    },
    {
        name: 'Setup QR Code Generator',
        key: '7',
        icon: <QrcodeOutlined />,
        screen: <SetupQrcodeGeneratorScreen />,
    },
]
