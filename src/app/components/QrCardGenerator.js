import { Button, Card, Space } from 'antd';
import React, { useCallback, useEffect, useRef } from 'react';

import { DownloadOutlined } from '@ant-design/icons';
import QRCode from 'qrcode.react';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import styles from './QrCardGenerator.module.css';

async function getImgDataURL(domNode) {
    const node = ReactDOM.findDOMNode(domNode);
    return html2canvas(node, {
        scrollY: -window.scrollY,
        useCORS: true,
    }).then(canvas => canvas.toDataURL('image/png', 1.0));
}

export const QrCardGenerator = ({
    title,
    description,
    value = null,
    onCardImageData,
    onQrImageData,
}) => {

    const qrCardRef = useRef();
    const onlyQrRef = useRef();

    const handleImgSave = useCallback(() => {
        getImgDataURL(qrCardRef.current).then(uri => {
            const link = document.createElement('a');

            if (typeof link.download === 'string') {
                link.href = uri;
                link.download = `Pflegebrille - ${title}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                window.open(uri);
            }
        });
    }, [title]);

    useEffect(() => {
        if (!value)
            return;
        if (onQrImageData)
            getImgDataURL(onlyQrRef.current).then(onQrImageData);
        if (onCardImageData)
            getImgDataURL(qrCardRef.current).then(onCardImageData);
    }, [onCardImageData, onQrImageData, value]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.qrCardWrapper} ref={qrCardRef}>
                <Card
                    className={styles.qrCard}
                    cover={
                        <div ref={onlyQrRef}>
                            <QRCode
                                level='L'
                                size={1024} /* render size */
                                value={value || 'no value'}
                                className={`${styles.qrCode} ${value ? '' : styles.noValue}`}
                            />
                        </div>
                    }
                >
                    {!value &&
                        <span>Noch nicht generiert</span>
                    }
                    {value &&
                        <>
                            {title}
                            <br />
                            {description}
                        </>
                    }
                </Card>
            </div>

            {value &&
                <Space>
                    <Button type="primary" ghost icon={<DownloadOutlined />} onClick={handleImgSave}>
                        Als Bild Speichern
                    </Button>
                </Space>
            }
        </div>
    );
};
