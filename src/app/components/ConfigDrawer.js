import './ui.css'

import * as actions from '../actions';
import * as selectors from '../selectors';

import { Button, Checkbox, Col, Divider, Drawer, Row, message } from 'antd';
import { CheckCircleTwoTone, UndoOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConfigEditor } from './ConfigEditor'
import { api } from '../api'
import moment from 'moment'

export const ConfigDrawer = () => {
    const [currentConfig, setCurrentConfig] = useState('')

    const dispatch = useDispatch()

    const isConfigDrawerVisible = useSelector(selectors.getIsConfigDrawerVisible)

    const hwid = useSelector(selectors.getHWID)

    const [lastReg, setLastReg] = useState('')

    const openConfigEditor = () => {
        dispatch(actions.setConfigEditorVisible(true))
    }

    const putTeleConfig = () => {
        const newConfig = { ...currentConfig };
        newConfig.entries.mainMenu = newConfig.entries.mainMenu.filter(it => it.moduleDir !== "scanner" && it.moduleDir !== "patient-info");
        newConfig.pds = null
        api.put(`/config/${hwid}`, newConfig).then(suc => {
            message.info(`Result: ${suc.data.status}`);
        })
            .catch(err => {
                message.error(`Result: ${err.response.data.error}`)
                err.response.data.detail.forEach(element => {
                    message.warn(element.dataPath + ' ' + element.message)
                });
            })
        hideConfigDrawer()
    }

    useEffect(() => {
        if (hwid) {
            api.get(`/device-info/${hwid}`).then(res => {
                setLastReg(res.data.timeLastRegister)
            })
        }
    }, [hwid])

    useEffect(() => {
        api.get(`/config/${hwid}`).then(res => {
            setCurrentConfig(res.data)
        })
    }, [hwid])

    const hideConfigDrawer = () => {
        dispatch(actions.setConfigDrawerVisible(false))
    }

    const deleteConfig = () => {
        api.get(`/config/default`).then(res => {
            api.delete(`/config/${hwid}`).then(suc => {
                message.info(`Result: ${suc.data.status}, refresh the device`);
            })
            setCurrentConfig(res.data)
            hideConfigDrawer()
        })
    }

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

    const options = [
        { label: 'Diagnosen', value: 'diagnosis' },
        { label: 'Wundverlauf', value: 'wound' },
        { label: 'Kontakte', value: 'contacts' },
        { label: 'Medikationsverlauf', value: 'medication' },
    ];
    const activePatientMenuOptions = []
    if (currentConfig.visibleData) {
        options.forEach((arrayItem) => {
            if (currentConfig.visibleData.hasOwnProperty(arrayItem.value)) {
                activePatientMenuOptions.push(arrayItem.value);
            }
        });
    }

    const setCheckboxValue = (checkboxValue) => {
        let tempConfig = currentConfig;
        api.get(`/config/default`).then(res => {
            tempConfig.visibleData = res.data.visibleData;
            let defaultVal = Object.keys(res.data.visibleData);
            defaultVal.forEach((arrayItem) => {
                if (!checkboxValue.includes(arrayItem) && arrayItem !== 'patient' && arrayItem !== 'woundDetails') {
                    delete tempConfig.visibleData[arrayItem];
                }
            });
            api.put(`/config/${hwid}`, tempConfig).then(suc => {
                message.info(suc.data.status);
            }).catch(err => {
                message.error(`Fehler beim Updaten der Config: ${err.response.data.error}`);
                err.response.data.detail.forEach(element => {
                    message.warn(element.dataPath + ' ' + element.message);
                });
            })
            setCurrentConfig(tempConfig);
        })
    }

    const putDefaultAttr = (attr) => {
        let tempConfig = currentConfig;
        switch (attr) {
            case '_configVersion': {
                api.get(`/config/default`).then(res => {
                    tempConfig._configVersion = res.data._configVersion
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'debug': {
                api.get(`/config/default`).then(res => {
                    tempConfig.debug = res.data.debug
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'enableActivityLog': {
                api.get(`/config/default`).then(res => {
                    tempConfig.enableActivityLog = res.data.enableActivityLog;
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'pds': {
                api.get(`/config/default`).then(res => {
                    tempConfig.pds = res.data.pds;
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'entries.mainMenu': {
                api.get(`/config/default`).then(res => {
                    tempConfig.entries.mainMenu = res.data.entries.mainMenu
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'entries.workflows': {
                api.get(`/config/default`).then(res => {
                    tempConfig.entries.workflows = res.data.entries.workflows
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'serviceUrls.connextServerUrl': {
                api.get(`/config/default`).then(res => {
                    tempConfig.serviceUrls.connextServerUrl = res.data.serviceUrls.connextServerUrl
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'serviceUrls.activityLogServiceUrl': {
                api.get(`/config/default`).then(res => {
                    tempConfig.serviceUrls.activityLogServiceUrl = res.data.serviceUrls.activityLogServiceUrl;
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'serviceUrls.packageRegistryUrl': {
                api.get(`/config/default`).then(res => {
                    tempConfig.serviceUrls.packageRegistryUrl = res.data.serviceUrls.packageRegistryUrl
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'serviceUrls.signalingServerUrl': {
                api.get(`/config/default`).then(res => {
                    tempConfig.serviceUrls.signalingServerUrl = res.data.serviceUrls.signalingServerUrl
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'serviceUrls.woundManagementServerUrl': {
                api.get(`/config/default`).then(res => {
                    tempConfig.serviceUrls.woundManagementServerUrl = res.data.serviceUrls.woundManagementServerUrl
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'serviceUrls.commandControlBackendUrl': {
                api.get(`/config/default`).then(res => {
                    tempConfig.serviceUrls.commandControlBackendUrl = res.data.serviceUrls.commandControlBackendUrl
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'workflowRegistryUrl': {
                api.get(`/config/default`).then(res => {
                    tempConfig.workflowRegistryUrl = res.data.workflowRegistryUrl
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'webAppVersion': {
                api.get(`/config/default`).then(res => {
                    tempConfig.webAppVersion = res.data.webAppVersion
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'callAppVersion': {
                api.get(`/config/default`).then(res => {
                    tempConfig.callAppVersion = res.data.callAppVersion
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            case 'kaldiModelVersion': {
                api.get(`/config/default`).then(res => {
                    tempConfig.kaldiModelVersion = res.data.kaldiModelVersion
                    api.put(`/config/${hwid}`, tempConfig).then(suc => {
                        message.info(suc.data.status);
                    })
                        .catch(err => {
                            message.error(`Result: ${err.response.data.error}`)
                            err.response.data.detail.forEach(element => {
                                message.warn(element.dataPath + ' ' + element.message)
                            });
                        })
                    setCurrentConfig(tempConfig)
                    hideConfigDrawer()
                })
                break;
            }
            default: 
                console.error(`Tried applying default attribute on unrecognized attribute '${attr}'`);
        }

    }

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <div className="site-description-item-profile-p-label" style={{ marginBottom: '0', marginTop: '0.5em', marginLeft: '0.5em' }}>{title}:&emsp;{content}</div>
        </div>
    );

    return (
        <>
            <ConfigEditor configID={hwid}></ConfigEditor>

            <Drawer visible={isConfigDrawerVisible} onClose={hideConfigDrawer} closable={false} width="50vw">
                <div>
                    <p className="site-description-item-profile-p">Endgerät Konfiguration</p>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <UndoOutlined style={{ visibility: 'hidden' }} />
                            <DescriptionItem title="Config" content={currentConfig._id === 'default' ? ('Standard') : ('Custom')} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <UndoOutlined style={{ visibility: 'hidden' }} />
                            <DescriptionItem title="ID" content={currentConfig._id} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <UndoOutlined style={{ visibility: 'hidden' }} />
                            <DescriptionItem title="Last Change" content={moment(currentConfig._lastChange).format('LLLL')} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <UndoOutlined style={{ visibility: 'hidden' }} />
                            <DescriptionItem title="Last Register" content={moment(lastReg).format('LLLL')} />
                            {lastReg > currentConfig._lastChange && (<CheckCircleTwoTone style={{ marginLeft: '10px' }} twoToneColor="#52c41a" />)}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('_configVersion')}><UndoOutlined /></Button>
                            <DescriptionItem title="Config Version" content={currentConfig._configVersion} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('pds')}><UndoOutlined /></Button>
                            <DescriptionItem title="PDS" content={currentConfig.pds} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('debug')}><UndoOutlined /></Button>
                            <DescriptionItem title="Debug" content={<Checkbox.Group options={['Debug Log', 'Gesture Simulator Bar', 'Redux Logger', 'Saga Logger', 'WebView LoadURL Override']} defaultValue={activeDebugOptions} disabled></Checkbox.Group>} />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">Activity Log</p>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('enableActivityLog')}><UndoOutlined /></Button>
                            <DescriptionItem title="Activity Log" content={<Checkbox checked={currentConfig.enableActivityLog} disabled>aktiviert</Checkbox>} />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">Entries</p>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('entries.mainMenu')}><UndoOutlined /></Button>
                            <DescriptionItem title="Main-Menu" content={
                                currentConfig.entries && currentConfig.entries.mainMenu && (currentConfig.entries.mainMenu.map((entry) => (
                                    `${entry.title} | `
                                )))
                            } />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('entries.workflows')}><UndoOutlined /></Button>
                            <DescriptionItem title="Workflows" content={
                                currentConfig.entries && currentConfig.entries.workflows && (currentConfig.entries.workflows.map((entry) => (
                                    `${entry.title} | `
                                )))
                            } />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('visibleData')}><UndoOutlined /></Button>
                            <DescriptionItem title="Patienteninfo" content={<Checkbox.Group options={options} defaultValue={activePatientMenuOptions} onChange={(value) => setCheckboxValue(value)} ></Checkbox.Group>} />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">Service Urls</p>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('serviceUrls.connextServerUrl')}><UndoOutlined /></Button>
                            <DescriptionItem title="Connext" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.connextServerUrl : ""} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('serviceUrls.activityLogServiceUrl')}><UndoOutlined /></Button>
                            <DescriptionItem title="Activity Log Service" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.activityLogServiceUrl : ""} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('serviceUrls.packageRegistryUrl')}><UndoOutlined /></Button>
                            <DescriptionItem title="Package Registry" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.packageRegistryUrl : ""} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('serviceUrls.signalingServerUrl')}><UndoOutlined /></Button>
                            <DescriptionItem title="Signaling Server" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.signalingServerUrl : ""} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('serviceUrls.woundManagementServerUrl')}><UndoOutlined /></Button>
                            <DescriptionItem title="Wund-Management Server" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.woundManagementServerUrl : ""} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('serviceUrls.commandControlBackendUrl')}><UndoOutlined /></Button>
                            <DescriptionItem title="Command & Control Backend" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.commandControlBackendUrl : ""} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('serviceUrls.workflowRegistry')}><UndoOutlined /></Button>
                            <DescriptionItem title="Workflow Registry" content={currentConfig.serviceUrls ? currentConfig.serviceUrls.workflowRegistryUrl : ""} />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">Web-App</p>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('webAppVersion')}><UndoOutlined /></Button>
                            <DescriptionItem title="Version" content={currentConfig.webAppVersion} />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">Call-App</p>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('callAppVersion')}><UndoOutlined /></Button>
                            <DescriptionItem title="Version" content={currentConfig.callAppVersion} />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">Android-Base</p>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('androidBaseVersion')}><UndoOutlined /></Button>
                            <DescriptionItem title="Version" content={currentConfig.androidBaseVersion} />
                        </Col>
                    </Row>

                    <Divider />

                    <p className="site-description-item-profile-p">Kaldi-Model</p>
                    <Row>
                        <Col className="detail__col" span={24}>
                            <Button type='link' onClick={() => putDefaultAttr('kaldiModelVersion')}><UndoOutlined /></Button>
                            <DescriptionItem title="Version" content={currentConfig.kaldiModelVersion} />
                        </Col>
                    </Row>
                </div>

                <div className='controls' style={{ marginTop: '4em' }}>
                    <p><Button className="controls__button" onClick={deleteConfig}>Auf Standardkonfiguration zurücksetzen</Button></p>
                    <p><Button className="controls__button" onClick={openConfigEditor}>Bearbeiten</Button></p>
                    <p><Button className="controls__button" onClick={putTeleConfig}>Als Telebrille einrichten</Button></p>
                </div>
            </Drawer>
        </>
    );
};
