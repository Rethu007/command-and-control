import { Alert, Button, Collapse, Form, Input, Layout, Popconfirm, Spin } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getPackageRegistryUrl, pathJoin } from '../../utils';

import { QrCardGenerator } from './QrCardGenerator';
import { QrCodePrintView } from './QrCodePrintView';
import { api } from '../api'
import styles from './PatientQrcodeGeneratorScreen.module.css';

const createPatientCode = ({ pds, klientId }) => {
    const payload = {
        pds,
        klientId,
    };
    return `pbp=${JSON.stringify(payload)}`;
};

export const PatientQrcodeGeneratorScreen = () => {

    const formRef = useRef(null);

    const [formData, setFormData] = useState({});
    const [qrCardValue, setQrCardValue] = useState();
    const [name, setName] = useState();
    const [qrImgDataURL, setQrImgDataURL] = useState();
    const [authError, setAuthError] = useState(false);
    const [errorMsg, setErrorMsg] = useState();
    const [patientOk, setPatientOk] = useState(false);
    const [wrongName, setWrongName] = useState(false);
    const [tryNr, setTryNr] = useState(0);
    const [dataLoading, setDataLoading] = useState(false);

    // todo fixme needs refactor
    // dont grab serviceurls via effect in this component,
    // use a side-wide approach to manage them
    const [serviceUrls, setServiceUrls] = useState(undefined);

    useEffect(() => {
        api.get(`/config/default`).then(res => {
            setServiceUrls(res.data.serviceUrls)
        })
    }, []);

    const updateFormData = useCallback((_, values) => {
        setFormData(values);
    }, [setFormData]);

    // todo needs refactor
    // use axios and proper api from backend
    const fetchUserLogin = useCallback(async (userId, password) => {
        const body = {
            "Username": userId,
            "Password": password,
            "UserGroupType": 3,
            "SectionId": 0
        };

        const res = await fetch(`${serviceUrls.connextServerUrl}/api/v2/LoginUser`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-requested-with': 'XMLHttpRequest',
            },
            body: JSON.stringify(body),
        });

        return (res.json());
    }, [serviceUrls]);

    // todo needs refactor
    // use axios and proper api
    const fetchPatientData = useCallback(async ({ serviceUrls, vivendiToken, patientId }) => {
        return fetch(`${serviceUrls.connextServerUrl}/api/v2/Klient/SucheNachIds?klientenIds=${patientId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-api-version': '2.0',
                'Auth-Token': vivendiToken,
                'x-requested-with': 'XMLHttpRequest',
            },
        });
    }, []);

    const authPatient = useCallback(async () => {
        try {
            const vivendiToken = await fetchUserLogin(formData.userId, formData.password);

            if (vivendiToken?.Message || vivendiToken === "Benutzername unbekannt oder Passwort ungültig.") {
                setErrorMsg("Benutzername unbekannt oder Passwort ungültig.");
                setAuthError(true);
                setDataLoading(false);

                setTryNr(cur => cur + 1);
            }
            else {

                const data = {
                    serviceUrls,
                    vivendiToken,
                    patientId: formData.klientId,
                }

                const res = await fetchPatientData(data)
                const patient = await res.json();
                if (res.ok && patient?.Klienten?.length > 0) {
                    const name = `${patient?.Klienten?.[0]?.Vorname} ${patient?.Klienten?.[0]?.Name}`;
                    setName(name);
                    setPatientOk(true)
                    setAuthError(false);
                    setDataLoading(false);
                    setTryNr(0);
                }
                else if (res.status === 442) {
                    setErrorMsg("Fehler: Die Logindaten für Vivendi sind inkorrekt.");
                    setAuthError(true);
                    setPatientOk(false);
                    setDataLoading(false);
                    setTryNr(cur => cur + 1);
                }
                else if (res.status === 500) {
                    setErrorMsg("Fehler: Es gibt ein Problem mit dem Vivendi Server");
                    setAuthError(true);
                    setPatientOk(false);
                    setDataLoading(false);
                    setTryNr(cur => cur + 1);
                }
                else if (res.status === 412 || !(patient?.Klienten?.length > 0)) {

                    setErrorMsg("Fehler: Es gibt keinen Patienten mit dieser Klienten ID");
                    setAuthError(true);
                    setPatientOk(false);
                    setDataLoading(false);
                    setTryNr(cur => cur + 1);
                }
                else {
                    setErrorMsg("Fehler: Es gab ein Problem beim Abrufen der Patientendaten");
                    setAuthError(true);
                    setPatientOk(false);
                    setDataLoading(false);
                    setTryNr(cur => cur + 1);
                }
            }
        }
        catch (err) {
            setErrorMsg("Fehler: Es gab ein Problem beim Abrufen der Patientendaten");
            setAuthError(true);
            setDataLoading(false);
            setTryNr(cur => cur + 1);
        }
    }, [formData, fetchUserLogin, fetchPatientData, serviceUrls])

    const create = useCallback(() => {
        setQrCardValue(createPatientCode(formData));
        setPatientOk(false);
        setWrongName(false);
    }, [formData]);

    const wrongID = useCallback(() => {
        setPatientOk(false);
        setWrongName(true);
    }, []);

    const patientLoad = useCallback(() => {
        authPatient();
        setWrongName(false);
        setDataLoading(true);
    }, [authPatient]);

    // Connext Server Url hasn't loaded yet
    if (serviceUrls?.connextServerUrl === undefined) {
        return (
            <>
                <Layout.Header className="site-layout-sub-header-background">
                    Patienten QR Code Generator
                </Layout.Header>
                <Layout.Content className={styles.content} >
                    <Spin tip={"Seite wird geladen."} />
                </Layout.Content>
            </>
        )
    }

    // Config or Connext Server Url isn't set (yet)
    if (!serviceUrls?.connextServerUrl) {
        return (
            <>
                <Layout.Header className="site-layout-sub-header-background">
                    Patienten QR Code Generator
                </Layout.Header>
                <Layout.Content className={styles.content} >
                    Keine Anbindung zu einer Pflegedokumentationssoftware vorhanden.
                </Layout.Content>
            </>
        )
    }

    return (
        <>
            <Layout.Header className="site-layout-sub-header-background">
                Patienten QR Code Generator
            </Layout.Header>
            <Layout.Content className={styles.content} >

                <div className={styles.alert}>
                    <h2>Hinweis!</h2>
                    <h3>Bitte stellen Sie sicher, dass von jedem Patienten, in dessen unmittelbare Nähe die Pflegebrille verwendet werden soll, eine Einverständniserklärung vorliegt. Für Patienten ist die Einverständniserklärung hier zu finden: <a href={pathJoin(getPackageRegistryUrl(), '/download/pdf/0.0.0%2BEinverstaendniserklaerung-Patienten-Zusammenfassung.pdf')}>Download</a></h3>
                    <h3>Für Betreuer ist die Einverständniserklärung hier zu finden: <a href={pathJoin(getPackageRegistryUrl(), '/download/pdf/0.0.0%2BEinverstaendniserklaerung-Betreuer-Zusammenfassung.pdf')}>Download</a></h3>
                </div>

                <Form className={styles.form}
                    ref={formRef}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onValuesChange={updateFormData}
                    onFinish={patientLoad}
                >
                    <Form.Item
                        label="Pflegedienstsoftware"
                        name="pds"
                        initialValue="vivendi"
                        rules={[{ required: true, message: "Die Angabe der PDS wird benötigt." }]}
                    >
                        <Input
                            disabled
                        />
                    </Form.Item>


                    <Form.Item
                        label="Vivendi UserId"
                        name="userId"
                        rules={[{ required: true, message: "Ihr Vivendi Benutzername wird benötigt." }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Vivendi Passwort"
                        name="password"
                        rules={[{ required: true, message: "Ihr Vivendi Passwort wird benötigt." }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Klienten ID"
                        name="klientId"
                        rules={[{ required: true, message: "Die ID des Klienten wird benötigt." }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="confirmButton"
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <Spin spinning={dataLoading}>
                            <Popconfirm
                                title={`Bitte prüfen Sie, ob der Name des Patienten korrekt ist: ${name}`}
                                visible={patientOk}
                                onConfirm={create}
                                onCancel={wrongID}
                                okText="Ja! Code erstellen"
                                cancelText="Nein"
                            >
                                <Button type="primary" onClick={formRef?.current?.submit} htmlType="submit">
                                    Weiter
                                </Button>
                            </Popconfirm>
                        </Spin>
                    </Form.Item>

                    {wrongName &&
                        <Alert
                            message="Bitte prüfen Sie, ob die Klienten ID des Patienten richtig ist."
                            type="info"
                        />
                    }

                    {tryNr > 1 &&
                        <Alert
                            message={`${tryNr}. Versuch fehlgeschlagen, bitte prüfen Sie Ihre Eingaben bzw. die Verbindung zur PDS.`}
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

                {qrCardValue &&
                    <>
                        <QrCardGenerator
                            title="Patienten Code"
                            description={name}
                            value={qrCardValue}
                            onQrImageData={setQrImgDataURL}
                        />

                        <QrCodePrintView
                            qrImg={qrImgDataURL}
                            title="Patienten Code"
                        />
                    </>
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