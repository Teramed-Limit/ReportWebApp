import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { isEmptyOrNil } from '../../../utils/general';
import { styles } from '../styles/style';

interface Props {
    logoUrl: string;
    reportName: string;
}

const PDFHeader = ({ logoUrl, reportName }: Props) => {
    return (
        <>
            <View style={styles.header} fixed>
                {!isEmptyOrNil(logoUrl) && <Image style={styles.hospitalLogo} src={logoUrl} />}
                <View style={styles.headerReportContainer}>
                    <Text style={styles.headerReport}>{reportName}</Text>
                </View>
            </View>
            <View style={styles.divider} fixed />
        </>
    );
};

export default React.memo(PDFHeader);
