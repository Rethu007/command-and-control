import { Button, Checkbox, Collapse, Divider, Layout, Space, Spin, Tooltip, Typography, message } from 'antd';
import { DeleteOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import { api, wApi } from '../api';

import styles from './WorkflowScreen.module.css';

const { Panel } = Collapse;
const antIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />;


export const WorkflowsScreen = () => {
    const [availableWorkflowNames, setAvailableWorkflowNames] = useState([]);
    const [publishedWorkflows, setPublishedWorkflows] = useState([]);
    // list of versions for currently in UI by user selected workflow (Collapse)
    const [availableVersionsDisplayed, setAvailableVersionsDisplayed] = useState([]);

    const isLoadingAvailableVersionsDisplayed = !availableVersionsDisplayed.length;


    useEffect(() => {
        wApi.get(`/list`).then(res => {
            setAvailableWorkflowNames(res.data);
        });
    }, []);


    useEffect(() => {
        api.get(`/config/default`).then(res => {
            setPublishedWorkflows(res.data.entries.workflows);
        });
    }, []);


    const updateDefaultConfigWorkflows = useCallback(updatedPublishedWorkflows => {
        api.get(`/config/default`).then(res => {
            const newDefaultConfig = res.data
            newDefaultConfig.entries.workflows = updatedPublishedWorkflows;

            api.put(`/config/default`, newDefaultConfig).then(suc => {
                message.info(suc.data.status);
            }).catch(err => {
                message.error(`Result: ${err.response.data.error}`)
                err.response.data.detail.forEach(element => {
                    message.warn(element.dataPath + ' ' + element.message)
                });
            });
        });
    }, []);


    const updateMetadata = useCallback((name, semver, cbMetadataUpdate) => {
        const updatedPublishedWorkflows = [...publishedWorkflows];
        const workflow = updatedPublishedWorkflows.find(w =>
            w.props.name === name && w.props.semver === semver);
        if (!workflow) {
            message.info('Workflow not published');
            return;
        }

        const newMetadata = cbMetadataUpdate(workflow.props.metadata);
        workflow.props = {
            ...workflow.props,
            metadata: {
                ...newMetadata
            }
        }

        setPublishedWorkflows(updatedPublishedWorkflows);
        updateDefaultConfigWorkflows(updatedPublishedWorkflows);
    }, [publishedWorkflows, setPublishedWorkflows, updateDefaultConfigWorkflows]);


    const publishWorkflow = useCallback((name, semver) => {
        const isAlreadyPublished = publishedWorkflows.find(w =>
            w.props.name === name && w.props.semver === semver);
        if (isAlreadyPublished) {
            message.info('Workflow is already published');
            return;
        }

        const workflow = {
            title: `${name}`,
            desc: `Concept Workflow zu ${name}`,
            img: `assets/workflow.png`,
            props: {
                name,
                semver,
                metadata: {
                    requiresWoundData: false,
                    requiresPatientData: false,
                },
            },
        }

        const updatedPublishedWorkflows = [...publishedWorkflows];
        const otherVersionIndex = updatedPublishedWorkflows.findIndex(w =>
            w.props.name === name);

        if (otherVersionIndex !== -1)
            // replace exiting other version of workflow
            // so that only one version of a worklfow can be published at the same time
            updatedPublishedWorkflows[otherVersionIndex] = workflow;
        else
            updatedPublishedWorkflows.push(workflow);

        setPublishedWorkflows(updatedPublishedWorkflows);
        updateDefaultConfigWorkflows(updatedPublishedWorkflows);
    }, [publishedWorkflows, setPublishedWorkflows, updateDefaultConfigWorkflows]);


    const unpublishWorkflow = useCallback((name, semver) => {
        const updatedPublishedWorkflows = [...publishedWorkflows];
        const index = updatedPublishedWorkflows.findIndex(w =>
            w.props.name === name && w.props.semver === semver);
        if (index === -1) {
            message.info('Workflow already unpublished');
            return;
        }

        updatedPublishedWorkflows.splice(index, 1);
        setPublishedWorkflows(updatedPublishedWorkflows);
        updateDefaultConfigWorkflows(updatedPublishedWorkflows);
    }, [publishedWorkflows, setPublishedWorkflows, updateDefaultConfigWorkflows]);


    const handleCheckboxChange = useCallback((name, semver, metadataKey) => {
        updateMetadata(name, semver, curMetadata => ({
            ...curMetadata,
            [metadataKey]: !curMetadata[metadataKey]
        }));
    }, [updateMetadata]);


    const handleDisplayAvailableVersions = useCallback((key) => {
        if (!key) return;

        setAvailableVersionsDisplayed([]);
        wApi.get(`/list/${key}`).then(res => {
            const versions = res.data.map(filename => filename.replace(/.zip$/, ''));
            setAvailableVersionsDisplayed(versions);
        });
    }, [setAvailableVersionsDisplayed,]);


    return (
        <>
            <Layout.Header className="site-layout-sub-header-background">
                Workflow Manager
            </Layout.Header>

            <Layout.Content className={styles.content}>

                <Typography.Title level={3}>Bereitgestellte Workflows</Typography.Title>

                <Space direction="vertical">
                    {publishedWorkflows.map(({ props: { name, semver, metadata } }) => (
                        <div key={`${name}_${semver}`}>
                            <Tooltip title="Version nicht bereitstellen" placement="top">
                                <Button
                                    type="link"
                                    onClick={() => unpublishWorkflow(name, semver)}
                                    icon={<DeleteOutlined />}
                                />
                            </Tooltip>
                            <span style={{ paddingLeft: '1em' }}>{name} {semver}</span>
                            <span className={styles.checkboxes}>
                                <Checkbox
                                    checked={metadata?.requiresWoundData}
                                    onChange={() => handleCheckboxChange(name, semver, 'requiresWoundData')}
                                >
                                    benötigt Wunddaten
                            </Checkbox>
                                <Checkbox
                                    checked={metadata?.requiresPatientData}
                                    onChange={() => handleCheckboxChange(name, semver, 'requiresPatientData')}
                                >
                                    benötigt Patientendaten
                            </Checkbox>
                            </span>
                        </div>
                    ))}
                </Space>

                <Divider />

                <Typography.Title level={3}>Verfügbare Workflows</Typography.Title>

                <Collapse className={styles.collapse} onChange={handleDisplayAvailableVersions} accordion ghost>
                    {availableWorkflowNames.map((name) => (
                        <Panel header={name} key={name}>
                            {isLoadingAvailableVersionsDisplayed ?
                                (
                                    <Spin indicator={antIcon} />
                                ) : (
                                    <Space direction="vertical">
                                        {availableVersionsDisplayed.map((semver) => (
                                            <div key={semver}>
                                                <Tooltip title="Version bereitstellen" placement="top">
                                                    <Button
                                                        style={{ paddingRight: '1.5em' }}
                                                        type="link"
                                                        onClick={() => publishWorkflow(name, semver)}
                                                        icon={<UploadOutlined />}
                                                    />
                                                </Tooltip>
                                                {semver}
                                            </div>
                                        ))}
                                    </Space>
                                )
                            }
                        </Panel>
                    ))}
                </Collapse>
            </Layout.Content>
        </>
    );
};