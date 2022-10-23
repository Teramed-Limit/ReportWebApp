import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { styles } from '../styles/style';

interface Props {
    signatureUrl: string;
}

const PDFFooter = ({ signatureUrl }: Props) => {
    return (
        <View fixed style={styles.footer}>
            <View style={styles.signatureContainer}>
                <Image style={styles.signatureImage} src={signatureUrl} />
                <View style={styles.divider} />
                <View style={styles.signatureTextContainer}>
                    <Text style={styles.signatureTitle}>Endoscopist</Text>
                    <View style={styles.signatureContent}>
                        <Text style={{ ...styles.signatureDoctor }}>Dr. Fung Tak Lit Derek</Text>
                        <Text style={{ ...styles.signatureSummary }}>
                            Specialist in General Surgery
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default React.memo(PDFFooter);
