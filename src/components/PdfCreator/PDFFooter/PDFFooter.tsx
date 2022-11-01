import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { UserSignature } from '../../../interface/user-signature';
import { styles } from '../styles/style';

interface Props {
    signatureData: UserSignature;
}

const PDFFooter = ({ signatureData }: Props) => {
    return (
        <View fixed style={styles.footer}>
            <View style={styles.signatureContainer}>
                <Image style={styles.signatureImage} src={signatureData.signatureUrl} />
                <View style={styles.divider} />
                <View style={styles.signatureTextContainer}>
                    <Text style={styles.signatureTitle}>Endoscopist</Text>
                    <View style={styles.signatureContent}>
                        <Text style={{ ...styles.signatureDoctor }}>
                            {signatureData.signatureEName}
                        </Text>
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
