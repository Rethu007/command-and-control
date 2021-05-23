import './ui.css'

import * as actions from '../actions';

import { Button, Checkbox, Col, Divider, Layout, Row } from 'antd';
import React, { useEffect, useState } from 'react';

import { ConfigEditor } from './ConfigEditor'
import { EditOutlined } from '@ant-design/icons';
import { api } from '../api'
import moment from 'moment'
import { useDispatch } from 'react-redux';

export const DefaultConfigScreen = () => {
    const dispatch = useDispatch()

    const [currentConfig, setCurrentConfig] = useState('')

    const openConfigEditor = () => {
        dispatch(actions.setConfigEditorVisible(true))
    }

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <div className="site-description-item-profile-p-label" style={{ marginBottom: '0', marginTop: '0.5em' }}>{title}:&emsp;{content}</div>
        </div>
    );

    useEffect(() => {
        api.get(`/config/default`).then(res => {
            setCurrentConfig(res.data)
        })
    }, [])
    const activeDebugOptions = []

    if (currentConfig.debug) {
        if (currentConfig.debug.enableDebugLog) {
            activeDebugOptions.push('Debug Log');
        }
        if (currentConfig.debug.enableGestureSimulatorBar) {
            activeDebugOptions.push('Gesture Simulator Bar');
        }
        if (currentConfig.debug.enableReduxLogger) {
            activeDebugOptions.push('Redux Logger');
        }
        if (currentConfig.debug.enableSagaLogger) {
            activeDebugOptions.push('Saga Logger');
        }
        if (currentConfig.debug.overrideWebViewLoadUrl) {
            activeDebugOptions.push('WebView LoadURL Override');
        }
    }

    return (
        <>
            <Layout.Header className="site-layout-sub-header-background">
                Standardkonfiguration
                <Button className="header__button" type="link" onClick={openConfigEditor} icon={<EditOutlined />} />
            </Layout.Header>

            <ConfigEditor configID="default"></ConfigEditor>

            <Layout.Content style={{ padding: "14px" }}>
                <p className="site-description-item-profile-p">Device Configuration</p>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="ID" content={currentConfig._id} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Last Change" content={moment(currentConfig._lastChange).format('LLLL')} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Config Version" content={currentConfig._configVersion} />
                    </Col>
                </Row>
                <Row>
                    <Col className="detail__col" span={24}>
                        <DescriptionItem title="PDS" content={currentConfig.pds} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Debug" content={<Checkbox.Group options={['Debug Log', 'Gesture Simulator Bar', 'Redux Logger', 'Saga Logger', 'WebView LoadURL Override']} defaultValue={activeDebugOptions} disabled></Checkbox.Group>} />
                    </Col>
                </Row>

                <Divider />

                <p className="site-description-item-profile-p">Activity Log</p>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Activity Log" content={<Checkbox checked={currentConfig.enableActivityLog} disabled>aktiviert</Checkbox>} />
                    </Col>
                </Row>

                <Divider />

                <p className="site-description-item-profile-p">Entries</p>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Main-Menu" content={
                            currentConfig.entries && currentConfig.entries.mainMenu && (currentConfig.entries.mainMenu.map((entry) => (
                                <span key={entry.title}>{entry.title + ' | '}</span>
                            )))
                        } />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Workflows" content={
                            currentConfig.entries && currentConfig.entries.workflows && (currentConfig.entries.workflows.map((entry) => (
                                <span key={entry.title}>{entry.title + ' | '}</span>
                            )))
                        } />
                    </Col>
                </Row>

                <Divider />

                <p className="site-description-item-profile-p">Service Urls</p>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Connext" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.connextServerUrl : ""} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Activity Log Service" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.activityLogServiceUrl : ""} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Package Registry" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.packageRegistryUrl : ""} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Signaling Server" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.signalingServerUrl : ""} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Wund-Management Server" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.woundManagementServerUrl : ""} />
                    </Col>
                </Row>
                <Row>
                    <Col className="detail__col" span={24}>
                        <DescriptionItem title="Command &amp; Control Backend" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.commandControlBackendUrl : ""} />
                    </Col>
                </Row>
                <Row>
                    <Col className="detail__col" span={24}>
                        <DescriptionItem title="Workflow Registry" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.workflowRegistryUrl : ""} />
                    </Col>
                </Row>


                <Divider />

                <p className="site-description-item-profile-p">Web-App</p>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Version" content={currentConfig.webAppVersion} />
                    </Col>
                </Row>

                <Divider />

                <p className="site-description-item-profile-p">Call-App</p>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Version" content={currentConfig.callAppVersion} />
                    </Col>
                </Row>

                <Divider />

                <p className="site-description-item-profile-p">Android-Base</p>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Version" content={currentConfig.androidBaseVersion} />
                    </Col>
                </Row>

                <Divider />

                <p className="site-description-item-profile-p">Kaldi-Model</p>
                <Row>
                    <Col span={24}>
                        <DescriptionItem title="Version" content={currentConfig.kaldiModelVersion} />
                    </Col>
                </Row>
            </Layout.Content>
        </>
    );
};
