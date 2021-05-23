import { Alert, Button, Collapse, Form, Input, Layout } from 'antd';
import React, { useCallback, useState } from 'react';

import { QrCardGenerator } from './QrCardGenerator';
import { QrCodePrintView } from './QrCodePrintView';
import { getCommandControlBackendUrl } from '../../utils';
import styles from './SetupQrcodeGeneratorScreen.module.css';

const createSetupCode = ({ backendUrl, wlanSsid, wlanPassword }) => {
    const payload = {
        url: backendUrl,
        wlan: [wlanSsid, wlanPassword],
    };
    return `pbs=${JSON.stringify(payload)}`;
};

export const SetupQrcodeGeneratorScreen = () => {

    const [formData, setFormData] = useState({});
    const [qrCardValue, setQrCardValue] = useState('');
    const [qrCardDescription, setQrCardDescription] = useState();
    const [qrImgDataURL, setQrImgDataURL] = useState();

    const updateFormData = useCallback((_, values) => {
        setFormData(values);
    }, [setFormData]);

    const createQrCard = useCallback(() => {
        setQrCardValue(createSetupCode(formData));
        setQrCardDescription(formData.backendUrl);
    }, [formData]);

    return (
        <>
            <Layout.Header className="site-layout-sub-header-background">
                Setup QR Code Generator
            </Layout.Header>
            <Layout.Content className={styles.content} >

                <Alert
                    message={"Setup QR Codes werden gebraucht um neue Pflegebrillen Anmeldeinformationen zu einem vorhandenen Netzwerk zu übergeben und die Verbindung zu Vivendi-Server einzurichten."}
                    type="info"
                />

                <Form
                    className={styles.form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onValuesChange={updateFormData}
                    onFinish={createQrCard}
                >
                    <Form.Item
                        label="Backend URL"
                        name="backendUrl"
                        initialValue={getCommandControlBackendUrl()}
                        rules={[{ required: true }]}
                    >
                        <Input
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        label="WLAN SSID"
                        name="wlanSsid"
                        rules={[{ required: true, message: "Die WLAN SSID wird benötigt." }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="WLAN Passwort"
                        name="wlanPassword"
                        rules={[{ required: true, message: "Das WLAN Passwort wird benötigt." }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <Button type="primary" htmlType="submit">
                            QR Code erstellen
                        </Button>
                    </Form.Item>
                </Form>

                <QrCardGenerator
                    title="Setup Code"
                    description={qrCardDescription}
                    value={qrCardValue}
                    onQrImageData={setQrImgDataURL}
                />


                {qrCardValue &&
                    <QrCodePrintView
                        qrImg={qrImgDataURL}
                        title="Setup Code"
                    />
                }

                <Collapse ghost>
                    <Collapse.Panel header="Code als Text" key="1">
                        <div style={{ wordBreak: 'break-all' }}>
                            {qrCardValue || 'noch nicht generiert'}
                        </div>
                    </Collapse.Panel>
                </Collapse>

            </Layout.Content>
        </>
    );
};
