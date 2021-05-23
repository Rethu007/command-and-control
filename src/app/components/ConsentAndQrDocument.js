import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import React from 'react';

const styles = StyleSheet.create({
    body: {
        // fontFamily: 'Open Sans',
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 50,
    },
    header: {
        fontSize: 10,
        marginBottom: 20,
        color: 'grey',
    },
    title: {
        fontSize: 13,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 'bold',
        marginVertical: 30,
    },
    text: {
        textAlign: 'justify',
        marginVertical: 5,
    },
    image: {
        width: '6.25cm',
        marginHorizontal: 4,
    },
    qrCodesPage: {
        paddingTop: 35,
        paddingBottom: 35,
        paddingHorizontal: 20,
    },
    qrCodes: {
        display: 'flex',
        flexDirection: 'row',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 35,
        textAlign: 'right',
        color: 'grey',
    },
});

const placeholderImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

export const ConsentAndQrDocument = ({
    name = '',
    qrImgDataURL = placeholderImg,
}) => {
    return (
        <Document>
            <Page style={styles.body}>
                <Text style={styles.header} fixed>
                    Forschungsverbund Pflegebrille vertreten durch die TU Clausthal, Marc Janßen, Arbeitsgruppe Human-Centered Information Systems, Julius-Albert-Straße 4, 38678 Clausthal-Zellerfeld. Tel.: +49 5323 72 7113
                </Text>
                <Text style={styles.title}>
                    Einverständniserklärung zur Mitwirkung an der Studie „Pflege mit Durchblick: Die Pflegebrille zur Unterstützung professionell und informell Pflegender“.
                </Text>
                <Text style={styles.text}>
                    Ich wurde von der verantwortlichen Person für die oben genannte Studie vollständig über Wesen, Bedeutung und Tragweite der Studie aufgeklärt. Ich habe das Informationsschreiben gelesen und verstanden.
                </Text>
                <Text style={styles.text}>
                    Ich hatte die Möglichkeit, Fragen zu stellen. Ich habe die Antworten verstanden und akzeptiere sie. Ich bin über die mit der Teilnahme an der Studie verbundenen Risiken und auch über den möglichen Nutzen informiert. Ich hatte ausreichend Zeit, mich zur Teilnahme an der Studie zu entscheiden und weiß, dass die Teilnahme freiwillig ist.
                </Text>
                <Text style={styles.text}>
                    Ich wurde darüber informiert, dass ich jederzeit und ohne Angabe von Gründen diese Zustimmung widerrufen kann, ohne dass dadurch Nachteile für mich entstehen. Ich wurde darüber informiert, dass sowohl Video als auch Audio aufgenommen werden.
                </Text>
                <View>
                    <Text>
                        ____________________________{'\n'}Ort,Datum
                    </Text>
                    <Text>
                        ____________________________{'\n'}Unterschrift des Forschers*In
                    </Text>
                    <Text>
                        ____________________________{'\n'}Unterschrift der/des Mitwirkenden{'\n'}{name}
                    </Text>
                </View>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages - 1}`
                )} fixed />
            </Page>
            <Page style={styles.qrCodesPage}>
                <View style={styles.qrCodes}>
                    <Image
                        style={styles.image}
                        src={qrImgDataURL}
                    />
                    <Image
                        style={styles.image}
                        src={qrImgDataURL}
                    />
                    <Image
                        style={styles.image}
                        src={qrImgDataURL}
                    />
                </View>
                <View style={styles.qrCodes}>
                    <Image
                        style={styles.image}
                        src={qrImgDataURL}
                    />
                    <Image
                        style={styles.image}
                        src={qrImgDataURL}
                    />
                    <Image
                        style={styles.image}
                        src={qrImgDataURL}
                    />
                </View>

            </Page>
        </Document>
    );
};
