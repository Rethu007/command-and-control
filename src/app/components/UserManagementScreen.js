import { Alert, Button, Checkbox, Form, Input, Layout, Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';

import { api } from '../api'
import styles from './UserManagementScreen.module.css';

export const UserManagementScreen = () => {

    const [formData, setFormData] = useState({});
    const [userList, setUserList] = useState([]);
    const [formResult, setFormResult] = useState([null, null]);
    const [userUpdate, setUserUpdate] = useState(false)

    const updateFormData = useCallback((_, values) => {
        setFormData(values);
    }, [setFormData]);

    const refreshUserList = useCallback(() => {
        api.get('/list-users').then(res => {
            res.data.forEach(dat => dat.key = dat._id);
            setUserList(res.data);
        });
    }, [setUserList]);

    const putUser = useCallback(() => {
        const user = {
            name: formData.name,
            password: formData.password || undefined,
            job: formData.job,
            admin: formData.admin,
        };

        api.put(`/user/${formData.userId}`, user).then(res => {
            setFormResult([res.data, null]);
            refreshUserList();
        }).catch(err => {
            setFormResult([null, err]);
            refreshUserList();
        });
    }, [formData, setFormResult, refreshUserList]);

    const deleteUser = useCallback(userId => {
        api.delete(`/user/${userId}`).then(res => {
            refreshUserList();
        });
    }, [refreshUserList]);

    useEffect(() => {
        refreshUserList();
    }, [refreshUserList]);

    const update = useCallback(() => {
        setUserUpdate(true);
    }, []);

    const columns = [
        {
            title: 'UserId',
            dataIndex: '_id',
            key: '_id',
            sorter: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
            sorter: true,
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
            render: () => "****"
        },
        {
            title: 'Job',
            dataIndex: 'job',
            key: 'job',
            width: '20%',
            sorter: true,
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
            key: 'admin',
            width: '5%',
            sorter: true,
            render: (_, record) => record.admin ? "Ja" : "Nein"
        },
        {
            title: 'Aktionen',
            key: 'action',
            width: '10%',
            render: (_, record) => (
                <Space size="middle" key={record._id}>
                    <Popconfirm
                        placement="topRight"
                        title="Löschen kann nicht rückgängig gemacht werden. Sicher?"
                        okText="Löschen"
                        cancelText="Abbrechen"
                        onConfirm={() => deleteUser(record._id)}
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Layout.Header className="site-layout-sub-header-background">
                Nutzerverwaltung
                <Button className="header__button" type="link" onClick={refreshUserList} icon={<SyncOutlined />} />
            </Layout.Header>

            <Layout.Content className={styles.content} >
                {!userUpdate &&
                    <Button type="primary" onClick={update}> Neuen Nutzer erstellen</Button>
                }

                <div className={styles.formWrapper}>
                    {userUpdate && <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onValuesChange={updateFormData}
                        onFinish={putUser}
                    >
                        <Form.Item
                            label="UserId"
                            name="userId"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Name (Anzeigename)"
                            name="name"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Passwort"
                            name="password"
                            rules={[{ required: true }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Job"
                            name="job"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Admin"
                            name="admin"
                            valuePropName="checked"
                        >
                            <Checkbox>Admin Rechte vergeben</Checkbox>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{ offset: 8, span: 16 }}
                        >
                            <Button type="primary" htmlType="submit">
                                Nutzer erstellen
                            </Button>
                        </Form.Item>


                        {formResult[0] &&
                            <Alert
                                message={"Änderung erfolgreich"}
                                type="success"
                            />
                        }
                        {formResult[1] &&
                            <Alert
                                message={"Fehler"}
                                type="error"
                            />
                        }
                    </Form>
                    }
                </div>

                <Table
                    columns={columns}
                    dataSource={userList}
                />

            </Layout.Content>
        </>
    );
};
