import './ui.css'

import { Button, Checkbox, Form, Input, Row, Select } from 'antd';

import React from 'react';

export const ConfigEditorEasy = (props) => {

    // const dispatch = useDispatch()

    // const [currentConfig, setCurrentConfig] = useState('')

    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 14,
        },
    };

    return (
        <Form name="validate_other" {...formItemLayout}>

            <p className="form-description-item-profile-p">Device Configuration</p>

            <Form.Item label="ID">
                <Input />
            </Form.Item>

            <Form.Item name="checkbox-group" label="Debug">
                <Checkbox.Group>
                    <Row>
                        <Checkbox value="A">Debug Log</Checkbox>
                        <Checkbox value="B">Redux Logger</Checkbox>
                        <Checkbox value="C">Saga Logger</Checkbox>
                    </Row>
                </Checkbox.Group>
            </Form.Item>

            <p className="form-description-item-profile-p">Entries</p>

            <Form.Item name="select-multiple" label="Main-Menu">
                <Select mode="tags" placeholder="Add entry then press enter..."></Select>
            </Form.Item>

            <Form.Item name="select-multiple" label="Workflows">
                <Select mode="tags" placeholder="Add entry then press enter..."></Select>
            </Form.Item>

            <p className="form-description-item-profile-p">Service Urls</p>

            <Form.Item label="Connext">
                <Input />
            </Form.Item>

            <Form.Item label="Package Registry">
                <Input />
            </Form.Item>

            <Form.Item label="Signaling Server">
                <Input />
            </Form.Item>

            <Form.Item label="Wund-Management Server">
                <Input />
            </Form.Item>

            <p className="form-description-item-profile-p">Web-App</p>

            <Form.Item label="Version">
                <Input />
            </Form.Item>

            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <Button style={{ width: '100px' }}>Apply</Button>
            </div>

        </Form>
    );

};