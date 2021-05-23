import { Button, Divider, Layout, message, Space, Tooltip, Typography, Upload } from 'antd';
import { DeleteOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { pApi } from '../api';

import styles from './WorkflowScreen.module.css';


export const KaldiModelsScreen = () => {
    const [availableModels, setAvailableModels] = useState([])
    const [fileList, setFileList] = useState([])
    const [uploading, setUploading] = useState(false)

    const handleChange = (info) => {
        let fileList = [...info.fileList];
        fileList = info.fileList.filter(file => (file.name.substr(file.name.lastIndexOf('.') + 1) === 'zip'));
        fileList = fileList.slice(-1);
        setFileList(fileList)
    }

    const props = {
        beforeUpload: file => {
            if (file.name.substr(file.name.lastIndexOf('.') + 1) !== 'zip') {
                message.error(`${file.name} is not a model file`);
            }
            return false;
        },
        onChange: handleChange
    };

    const getModels = () => {
        setAvailableModels([])
        pApi.get(`/list/model/`).then(res => {
            if (res && res.data) {
                setAvailableModels(res.data);
            }
        });
    }

    const handleUpload = () => {
        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj);
        setUploading(true)
        pApi.post(`/upload/model/${fileList[0].originFileObj.name.substring(0, fileList[0].originFileObj.name.lastIndexOf('.'))}`,
            formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            message.info(`Result: ${res.data.status}`);
            setUploading(false)
            setFileList([])
            getModels()
        }).catch(err => {
            if (err.response) {
                message.error(`Result: ${err.response.data.error}`)
                if (err.response.data.detail) {
                    err.response.data.detail.forEach(element => {
                        message.warn(element.dataPath + ' ' + element.message)
                    });
                }
            } else {
                message.error(`${err}`)
            }
            setUploading(false)
        });
    }

    const handleDelete = (model) => {
        pApi.delete(`/delete-file/model/${model}`).then(res => {
            message.info(`Result: ${res.data.status}`);
            getModels()
        }).catch(err => {
            if (err.response) {
                message.error(`Result: ${err.response.data.error}`)
                err.response.data.detail.forEach(element => {
                    message.warn(element.dataPath + ' ' + element.message)
                });
            } else {
                message.error(`${err}`)
            }
        });
    }

    useEffect(() => {
        pApi.get(`/list/model/`).then(res => {
            setAvailableModels(res.data);
        });
    }, []);

    return (
        <>
            <Layout.Header className="site-layout-sub-header-background">
                Kaldi-Modelle Manager
            </Layout.Header>

            <Layout.Content className={styles.content}>

                <Typography.Title level={3}>Bereitgestellte Modelle</Typography.Title>

                <Space direction="vertical">
                    {availableModels.length > 0 ?
                        availableModels.map((model) => (
                            <div key={model}>
                                <Tooltip title="Version nicht bereitstellen" placement="top">
                                    <Button
                                        type="link"
                                        onClick={() => handleDelete(model)}
                                        icon={<DeleteOutlined />}
                                    />
                                </Tooltip>
                                <span style={{ paddingLeft: '1em' }}>{model}</span>
                            </div>
                        )) :
                        'Keine bereitgestellten Modelle'
                    }
                </Space>

                <Divider />

                <Typography.Title level={3}>Kaldi-Model hochladen</Typography.Title>

                <Upload {...props} fileList={fileList}>
                    <Button block size="large" icon={<FileOutlined />}>Select File</Button>
                </Upload>

                <Button block size="large" icon={<UploadOutlined />} type="primary" disabled={fileList.length === 0} loading={uploading} onClick={handleUpload} style={{ marginTop: 7 }}>
                    {uploading ? 'Uploading' : 'Upload'}
                </Button>

            </Layout.Content>
        </>
    );
};