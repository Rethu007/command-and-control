import { Alert, Button, Checkbox, Collapse, Form, Input, Layout, Spin } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { getPackageRegistryUrl, pathJoin } from '../../utils';

import Anleitung from './Anleitung.pdf'
import { QrCardGenerator } from './QrCardGenerator';
import { QrCodePrintView } from './QrCodePrintView';
import { api } from '../api'
import styles from './LoginQrcodeGeneratorScreen.module.css';

// hint: multiple form error in console appear because of 2 password type inputs in same form
export const LoginQrcodeGeneratorScreen = () => {

    const formRef = useRef(null);

    const [formData, setFormData] = useState({});
    const [authError, setAuthError] = useState();
    const [qrCardValue, setQrCardValue] = useState('');
    const [qrCardDescription, setQrCardDescription] = useState();
    const [useVivendi, setUseVivendi] = useState(true);
    const [errorMsg, setErrorMsg] = useState();
    const [tryNr, setTryNr] = useState(0);
    const [dataLoading, setDataLoading] = useState(false);
    const [qrImgDataURL, setQrImgDataURL] = useState();

    const updateFormData = useCallback((_, values) => {
        setFormData(values);
    }, [setFormData]);

    const createQrcode = useCallback(() => {
        const auth = {
            plain: {
                userId: formData.userId,
                password: formData.password,
                vivendi: [formData.vivendiUsername, formData.vivendiPassword]
            },
            authUser: true,
            authVivendi: useVivendi,
        };
        api.post('/auth', auth).then(res => {
            setQrCardValue(res.data.token);
            setQrCardDescription(formData.userId);
            setAuthError(null);
            setTryNr(0);
            setDataLoading(false);
        }).catch(err => {
            if (err.response?.data?.error === "wrong login data") {

                setErrorMsg("Fehler: Die Pflegebrille Logindaten sind falsch");

                setTryNr(cur => cur + 1);
            }
            else if (err.response?.data?.error === "vivendi timeout") {
                setErrorMsg("Fehler: Problem mit Vivendi Server");
                setTryNr(cur => cur + 1);
            }
            else {
                setErrorMsg("Fehler: Die Vivendi Logindaten sind falsch ");
                setTryNr(cur => cur + 1);
            }
            setAuthError(err);
            setDataLoading(false);
        });
    }, [formData, setQrCardValue, setAuthError, useVivendi]);

    const handleQrImgData = useCallback(setQrImgDataURL, []);

    const setProvider = (e) => {
        if (e.target.checked) {
            setUseVivendi(true);
        } else {
            setUseVivendi(false);
        }
    };

    const userLoad = useCallback(() => {
        createQrcode();
        setDataLoading(true);
    }, [createQrcode]);

    return (
        <>
            <Layout.Header className="site-layout-sub-header-background">
                Anmelde QR Code Generator
            </Layout.Header>

            <Layout.Content className={styles.content} >

                <div className={styles.alert}>
                    <h2>Hinweis!</h2> 
                    <h3>Bitte stellen Sie sicher, dass jeder, der die Pflegbrille verwendet, folgende Einverständniserklärung ausgefüllt und unterschrieben hat: <a href={pathJoin(getPackageRegistryUrl(), '/download/pdf/0.0.0%2BEinverstaendniserklaerung-Mitarbeiter-Zusammenfassung.pdf')}download="Anleitung.pdf">Download</a></h3>
                    <h3>Achten Sie zudem bitte darauf, dass die Pfleger eine ausreichende Einweisung in die Bedienung und Möglichkeiten der Pflegebrille erhalten. Eine Kurzanleitung zur Pflegebrille ist hier zu finden: <a href={Anleitung} download="Anleitung.pdf">Download</a></h3>
                </div>

                <Form className={styles.form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onValuesChange={updateFormData}

                    onFinish={userLoad}
                >
                    <Form.Item
                        label="Pflegebrille UserId"
                        name="userId"
                        rules={[{ required: true, message: "Pflegebrille UserId wird benötigt." }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Pflegebrille Passwort"
                        name="password"
                        rules={[{ required: true, message: "Pflegebrille Passwort wird benötigt." }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Checkbox defaultChecked={useVivendi} onChange={(e) => setProvider(e)}>Vivendi</Checkbox>
                    </Form.Item>

                    {useVivendi && (
                        <Form.Item
                            label="Vivendi Nutzername"
                            name="vivendiUsername"
                            rules={[{ required: true, message: "Vivendi Nutzername wird benötigt." }]}
                        >
                            <Input />
                        </Form.Item>
                    )}

                    {useVivendi && (
                        <Form.Item
                            label="Vivendi Passwort"
                            name="vivendiPassword"
                            rules={[{ required: true, message: "Vivendi Passwort wird benötigt." }]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}

                    <Form.Item
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <Spin spinning={dataLoading}>
                            <Button type="primary" onClick={formRef?.current?.submit} htmlType="submit">
                                QR Code erstellen
                            </Button>
                        </Spin>
                    </Form.Item>

                    {tryNr > 1 &&
                        <Alert
                            message={`${tryNr}. Versuch fehlgeschlagen, bitte wiederholen`}
                            type="error"
                        />
                    }

                    {authError &&
                        <Alert
                            message={errorMsg}
                            type="error"
                        />
                    }
                </Form>

                <QrCardGenerator
                    title="Anmelde Code"
                    description={qrCardDescription}
                    value={qrCardValue}
                    onQrImageData={handleQrImgData}
                />

                {qrCardValue &&
                    <QrCodePrintView
                        qrImg={qrImgDataURL}
                        title="Anmelde Code"
                    />
                }

                <Collapse ghost>
                    <Collapse.Panel header="Token als Text" key="1">
                        <div style={{ wordBreak: 'break-all' }}>
                            {qrCardValue || 'noch nicht generiert'}
                        </div>
                    </Collapse.Panel>
                </Collapse>

            </Layout.Content>
        </>
    );
};
