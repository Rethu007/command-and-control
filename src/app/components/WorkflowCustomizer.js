import './ui.css'

import * as actions from '../actions';
import * as selectors from '../selectors';

import { Button, Checkbox, Modal, Spin, message } from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { api } from '../api'

const antIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />;


export const WorkflowCustomizer = () => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [currentWorkflows, setCurrentWorkflows] = useState('')

    const [currentConfig, setCurrentConfig] = useState('')

    const [defaultConfig, setDefaultConfig] = useState('')

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch()

    const isWorkflowCustomizerVisible = useSelector(selectors.getIsWorkflowCustomizerVisible)

    const hwid = useSelector(selectors.getHWID)

    useEffect(() => {
        setIsLoading(true);
        api.get(`/config/default`).then(res => {
            setDefaultConfig(res.data)
            setIsLoading(false);
        })
    }, [hwid, isWorkflowCustomizerVisible])

    useEffect(() => {
        setIsLoading(true);
        api.get(`/config/${hwid}`).then(res => {
            setCurrentConfig(res.data)
            setCurrentWorkflows(res.data.entries.workflows)
            setIsLoading(false);
        })
    }, [hwid, isWorkflowCustomizerVisible])

    let availWorkflows = []
    if (defaultConfig) {
        defaultConfig.entries.workflows.forEach(entry => {
            availWorkflows.push(entry)
        });
    }

    const hideWorkflowCustomizer = () => {
        dispatch(actions.setWorkflowCustomizerVisible(false))
    }

    const check = (e, entry, semver) => {
        let tempConfig = currentConfig
        if (entry) {
            if (e === false || (e.target && (e.target.checked === false))) {
                tempConfig.entries.workflows.forEach(element => {
                    if (element.props.name === entry && element.props.semver === semver) {
                        const index = tempConfig.entries.workflows.indexOf(element);
                        if (index > -1) {
                            tempConfig.entries.workflows.splice(index, 1);
                        }
                        setCurrentConfig(tempConfig)
                    }
                });
            }
            if (e.target && (e.target.checked === true)) {
                defaultConfig.entries.workflows.forEach(element => {
                    if (element.props.name === entry && element.props.semver === semver) {
                        tempConfig.entries.workflows.push(element)
                        setCurrentConfig(tempConfig)
                    }
                });
            }
        }
        forceUpdate()
    }

    const pushConfig = () => {
        api.put(`/config/${hwid}`, currentConfig).then(res => {
            message.info(`Result: ${res.data.status}, refresh page to see changes`);
        })
            .catch(err => {
                message.error(`Result: ${err.response.data.error}`)
                err.response.data.detail.forEach(element => {
                    message.warn(element.dataPath + ' ' + element.message)
                });
            })
        hideWorkflowCustomizer()
    }

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <div className="site-description-item-profile-p-label" style={{ marginBottom: '0', marginTop: '0.5em', marginLeft: '0.5em' }}>{content}&emsp;{title}</div>
        </div>
    );

    return (
        <>
            <Modal closable={false} visible={isWorkflowCustomizerVisible} onCancel={hideWorkflowCustomizer} onOk={pushConfig}>
                <div>
                    <p className="site-description-item-profile-p">Configure workflows to deploy:</p>
                    <div>
                        <div>Deployed Workflows:</div>
                        {
                            isLoading ? (<Spin indicator={antIcon} />) : (
                                currentWorkflows && (currentWorkflows.map((entry) => (
                                    <DescriptionItem key={entry} title={`${entry.props.name} ${entry.props.semver}`} content={
                                        <Button style={{ lineHeight: '1em' }} type="link" onClick={() => check(false, entry.props.name, entry.props.semver)} icon={<DeleteOutlined />} />
                                    } />
                                ))))}
                        <div style={{ marginTop: '1em' }}>Published Workflows:</div>
                        {
                            isLoading ? (<Spin indicator={antIcon} />) : (
                                availWorkflows && (availWorkflows.map((entry) => (
                                    <DescriptionItem key={entry} title={`${entry.props.name} ${entry.props.semver}`} content={<Checkbox onChange={(e) => check(e, entry.props.name, entry.props.semver)} defaultChecked={currentWorkflows && (currentWorkflows.some(e => e.props.name === entry.props.name)) && (currentWorkflows.some(e => e.props.semver === entry.props.semver))} />} />
                                ))))}
                    </div>
                </div>
            </Modal>
        </>
    );
};