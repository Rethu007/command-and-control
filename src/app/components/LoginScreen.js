import * as actions from '../actions';

import { Button, Form, Input } from 'antd';

import React from 'react';
import logo from '../../assets/logo.png';
import styles from './LoginScreen.module.css';
import { updateAuth } from '../api';
import { useDispatch } from 'react-redux';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const LoginScreen = () => {
    const dispatch = useDispatch();

    const onFinish = values => {
        updateAuth(values.username, values.password);
        dispatch(actions.setLoginData(values));
    };

    return (
        <div className={styles.wrapper}>
            <img src={logo} alt="" className={styles.logo} />
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Nutzername"
                    name="username"
                    rules={[{ required: true, message: 'Bitte Nutzername eingeben.' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Passwort"
                    name="password"
                    rules={[{ required: true, message: 'Bitte Passwort eingeben.' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
