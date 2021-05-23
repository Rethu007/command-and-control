import { Alert, Button, Form, Input, Layout, Space } from 'antd';
import React, { useCallback, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { PrinterOutlined } from '@ant-design/icons';
import styles from './QrCodePrintView.module.css';
import positionQRcode from './positionQRcode.png';
import { QrcodePosition } from './QrcodePosition';

const placeholderImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

export const QrCodePrintView = ({
    qrImg = placeholderImg,
    title,
}) => {

    const [formData, setFormData] = useState({});
    const [printView, setPrintView] = useState(false);
    const [position, setPosition] = useState(0);
    const [errorMsg, setErrorMsg] = useState();
    const [inputError, setInputError] = useState(false);
    const [printer, setPrinter] = useState(false);

    const qrCardRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => qrCardRef.current,
        documentTitle: `Pflegebrille - ${title}`,
    });

    const getPrintPosition = useCallback(() => {
        if (formData.position > 0 && formData.position < 13) {
            setPosition(formData.position);
            setPrintView(true);
            setPrinter(true);
            setInputError(false);
        }
        else {
            setErrorMsg("ERROR: bitte Druckstelle zwischen 1-12 angeben");
            setInputError(true);
            if (printer) {
                setPrinter(false);
            }
            setPrintView(false)
        }
    }, [formData, printer]);

    const updateFormData = useCallback((_, values) => {
        setFormData(values);
    }, [setFormData]);


    return (
        <>
            <Layout.Content className={styles.content} >
                <Alert
                    message={"Für den Druck des QR-Codes auf DIN A4 Etikettenpapier (60 x 60 mm, 12 pro Bogen) können sie im folgenden passende Dateien zum Drucken herstellen. Wählen Sie lediglich aus, welche Etikette Sie auf dem Bogen bedrucken möchten."}
                    type="info"
                />
                <img
                    className={styles.image}
                    src={positionQRcode}
                    alt=""
                />

                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onValuesChange={updateFormData}
                    onFinish={getPrintPosition}
                >
                    <Form.Item
                        label="Druckstelle eingeben"
                        name="position"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>

                <Space>
                    <Button type="primary" onClick={getPrintPosition}>
                        QR Code generieren
                    </Button>
                    {printer &&
                        <Button type="primary" ghost icon={<PrinterOutlined />} onClick={handlePrint}>
                            Drucken
                        </Button>
                    }
                </Space>

                {inputError &&
                    <Alert
                        message={errorMsg}
                        type="error"
                    />
                }

                <div className={styles.printView} ref={qrCardRef} >
                    {printView &&
                        <QrcodePosition
                            qrImgDataURL={qrImg}
                            position={position - 1}
                        />
                    }
                </div>
            </Layout.Content>
        </>
    )


}