import { StyleSheet } from '@react-pdf/renderer';

import React from 'react';

const styles = StyleSheet.create({
    image: {
        width: '5.75cm',
        margin: 8,
    },
    qrCodesPage: {
        paddingTop: 60,
        paddingBottom: 60,
        paddingLeft: 35,
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 'medium',
    },
    qrCodes: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
    },
});

const placeholderImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC"

export const QrcodePosition = ({
    qrImgDataURL = placeholderImg,
    position = 0,
}) => {
    const qrImg = new Array(12);
    qrImg.fill(placeholderImg);
    qrImg[position] = qrImgDataURL;

    return (
        <div style={styles.qrCodesPage}>
            <div style={styles.qrCodes}>
                <img
                    style={styles.image}
                    src={qrImg[0]}
                    alt=""
                />
                <img
                    style={styles.image}
                    src={qrImg[1]}
                    alt=""
                />
                <img
                    style={styles.image}
                    src={qrImg[2]}
                    alt=""
                />
            </div>
            <div style={styles.qrCodes}>
                <img
                    style={styles.image}
                    src={qrImg[3]}
                    alt=""
                />
                <img
                    style={styles.image}
                    src={qrImg[4]}
                    alt=""
                />
                <img
                    style={styles.image}
                    src={qrImg[5]}
                    alt=""
                />
            </div>
            <div style={styles.qrCodes}>
                <img
                    style={styles.image}
                    src={qrImg[6]}
                    alt=""
                />
                <img
                    style={styles.image}
                    src={qrImg[7]}
                    alt=""
                />
                <img
                    style={styles.image}
                    src={qrImg[8]}
                    alt=""
                />
            </div>
            <div style={styles.qrCodes}>
                <img
                    style={styles.image}
                    src={qrImg[9]}
                    alt=""
                />
                <img
                    style={styles.image}
                    src={qrImg[10]}
                    alt=""
                />
                <img
                    style={styles.image}
                    src={qrImg[11]}
                    alt=""
                />
            </div>
        </div>
    );
};