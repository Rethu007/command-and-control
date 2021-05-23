import './ui.css'

import * as actions from '../actions';
import * as selectors from '../selectors';

import { Button, Card, Col, Dropdown, Input, Layout, Menu, Modal, Row, message } from 'antd';
import { EditOutlined, PlusOutlined, SortAscendingOutlined, SyncOutlined } from '@ant-design/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import android_tablet from '../../assets/android_tablet.png';
import { api } from '../api';
import epson_bt300 from '../../assets/epson_bt300.png';
import moment from 'moment';
import vuzix_blade from '../../assets/vuzix_blade.png';

const deviceModelNameToImageSrc = (modelName) => {
    switch (modelName.toLowerCase()) {
        case 'blade':
            return vuzix_blade;
        case 'embt3c':
            return epson_bt300;
        case 'embt3s':
            return epson_bt300;
        default:
            return android_tablet;
    }
};

export const DevicesScreen = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [sorting, setSorting] = useState('lastRegister');
    const [focusHwid, setFocusHwid] = useState('')
    const [customName, setCustomName] = useState('')

    const dispatch = useDispatch()

    useEffect(() => {
        api.get('/list-devices').then(res => {
            dispatch(actions.setDevices(res.data))
        })
    }, [dispatch])

    const unsortedDevices = useSelector(selectors.getDevices);

    const devices = useMemo(() => {
        if (!unsortedDevices)
            return null;

        let compFn;
        if (sorting === 'lastRegister') {
            compFn = (a, b) => (b.timeLastRegister || 0) - (a.timeLastRegister || 0);
        } else if (sorting === 'baseVersion') {
            compFn = (a, b) => (b.baseVersion || 'zzz').localeCompare(a.baseVersion || 'zzz');
        } else if (sorting === 'name') {
            compFn = (a, b) => (a.customName || 'zzz').localeCompare(b.customName || 'zzz');
        }

        return [...unsortedDevices].sort(compFn);
    }, [sorting, unsortedDevices]);

    const refresh = () => {
        api.get('/list-devices').then(res => {
            dispatch(actions.setDevices(res.data))
        });
    }

    const handleSortOptionClick = ({ key }) => {
        setSorting(key);
    };

    const menu = (
        <Menu onClick={handleSortOptionClick}>
            <Menu.Item key="lastRegister">Last Register (Desc)</Menu.Item>
            <Menu.Item key="name">Name</Menu.Item>
            <Menu.Item key="baseVersion">Base Version (Desc)</Menu.Item>
        </Menu>
    );

    const handleParentClick = (hwid) => {
        dispatch(actions.setHWID(hwid))
        dispatch(actions.setConfigDrawerVisible(true))
    }

    const handleChildClick = (e, hwid) => {
        e.stopPropagation();
        setFocusHwid(hwid)
        setModalVisible(true)
    }

    const updateName = () => {
        const body = { customName: customName }
        api.put(`/device-info/${focusHwid}`, body).then(res => {
            message.info(`Result: ${res.data.status}, refresh page to see changes`);
        })
            .catch(err => {
                message.error(`Result: ${err.response.data.error}`)
                err.response.data.detail.forEach(element => {
                    message.warn(element.dataPath + ' ' + element.message)
                });
            })
        setModalVisible(false)
    }

    const entry = (e) => {
        setCustomName(e.target.value)
    }

    const test = (hwid) => {
        dispatch(actions.setHWID(hwid))
        dispatch(actions.setWorkflowCustomizerVisible(true))
    }

    const deleteDevice = (hwid) => {
        setFocusHwid(hwid)
        setDeleteModalVisible(true)
    }

    const confirmDeleteDevice = () => {
        api.delete(`/device-info/${focusHwid}`).then(res => {
            message.info(`Result: ${res.data.status}, refresh page to see changes`);
        })
            .catch(err => {
                message.error(`Result: ${err.response.data.error}`)
                err.response.data.detail.forEach(element => {
                    message.warn(element.dataPath + ' ' + element.message)
                });
            })
        setDeleteModalVisible(false)
    }

    return (
        <>
            <Layout.Header className="site-layout-sub-header-background">

                Geräte

                <Dropdown className="og" overlay={menu}>
                    <Button className="header__button" type="link" onClick={e => e.preventDefault()} icon={<SortAscendingOutlined />} />
                </Dropdown>

                <Button className="header__button" type="link" onClick={refresh} icon={<SyncOutlined />} />

            </Layout.Header>

            <Modal centered={true} onCancel={() => setModalVisible(false)} onOk={updateName} closable={false} className='custom-name-modal' visible={modalVisible}>
                <Input onChange={(e) => entry(e)} placeholder="Device custom name..." />
            </Modal>

            <Modal centered={true} onCancel={() => setDeleteModalVisible(false)} onOk={confirmDeleteDevice} closable={false} className='custom-name-modal' visible={deleteModalVisible}>
                Möchten Sie wirklich dieses Gerät entfernen?
            </Modal>

            <Layout.Content className="devices">
                {devices && (devices.map((device) => (
                    <div key={device._id} className="container">
                        <Card key={device._id} onClick={() => handleParentClick(device._id)} hoverable bordered={false} style={{ width: '345px' }}
                            cover={<img src={deviceModelNameToImageSrc(device.modelName)} alt='' />}>
                            <div className='status'>{device.modelName}</div>
                            {device.customName ? (
                                <Row>
                                    <Col className="detail__col" span={24}>
                                        <div className='custom-name'>{device.customName}</div>
                                        <Button type='link' style={{ marginLeft: '5px' }} onClick={(e) => handleChildClick(e, device._id)}><EditOutlined /></Button>
                                    </Col>
                                </Row>
                            ) : (<div style={{ height: '30px', paddingTop: '5px' }}><Button type='link' onClick={(e) => handleChildClick(e, device._id)}><PlusOutlined /></Button></div>)}
                            <div className='details'>
                                <p>Base Version: {device.baseVersion}</p>
                                <p>Letzte IP: {device.lastIp}</p>
                                <p>Erster Sync: {moment(device.timeFirstRegister).calendar()}</p>
                                <p>Letzter Sync: {moment(device.timeLastRegister).calendar()}</p>
                                <p>ID: {device._id}</p>
                            </div>
                        </Card>
                        <div className="middle">
                            <Button type='link' onClick={() => test(device._id)} className="text">Workflows</Button>
                            <Button type='link' onClick={() => deleteDevice(device._id)} className="deletetext">Delete</Button>
                        </div>
                    </div>
                )))}
            </Layout.Content>
        </>
    );
};
