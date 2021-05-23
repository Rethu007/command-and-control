import './ui.css'

import * as actions from '../actions';
import * as selectors from '../selectors';

import { Button, Modal, Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ReactJson from 'react-json-view'
import { api } from '../api'

export const ConfigEditor = (props) => {

    const dispatch = useDispatch()

    const [currentConfig, setCurrentConfig] = useState('')

    const isConfigEditorVisible = useSelector(selectors.getIsConfigEditorVisible)

    const { TabPane } = Tabs;

    const closeConfigEditor = () => {
        dispatch(actions.setConfigEditorVisible(false))
    }

    useEffect(() => {
        api.get(`/config/${props.configID}`).then(res => {
            setCurrentConfig(res.data)
        })
    }, [props])

    const onEdit = (edit) => {
        setCurrentConfig(edit.updated_src)
    }

    const putConfig = () => {
        api.put(`/config/${props.configID}`, currentConfig).then(res => {
            message.info(`Result: ${res.data.status}, refresh page to see changes`);
        })
            .catch(err => {
                message.error(`Result: ${err.response.data.error}`)
                err.response.data.detail.forEach(element => {
                    message.warn(element.dataPath + ' ' + element.message)
                });
            })
        dispatch(actions.setConfigEditorVisible(false))
        //window.location.reload(false);
    }

    const operations = <><Button style={{ width: '100px' }} onClick={closeConfigEditor}>Cancel</Button> <Button className="ant-btn-primary" style={{ width: '100px' }} onClick={putConfig}>Apply</Button></>

    return (
        <Modal closable={false} centered={true} footer={null} visible={isConfigEditorVisible} width="860px" onCancel={closeConfigEditor}>
            <Tabs tabBarExtraContent={operations}>
                <TabPane tab="JSON" key="1">
                    <ReactJson onEdit={(edit) => onEdit(edit)} onAdd={(edit) => onEdit(edit)} onDelete={(edit) => onEdit(edit)} src={currentConfig} />
                </TabPane>
                {/*<TabPane tab="Easy" key="2">
                    <div className="wip">
                        <div className="wip__overlay">This function is still under development.</div>
                        <ConfigEditorEasy></ConfigEditorEasy>
                    </div>
                </TabPane>*/}
            </Tabs>
        </Modal>
    );
};