import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { UserAccountInfo } from '../../../interface/auth';
import { styles } from '../styles/style';

interface Props {
    signatureData: UserAccountInfo;
}

const PDFFooter = ({ signatureData }: Props) => {
    return (
        <>
            <ReactPDF.Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                fixed
            />
            <ReactPDF.View fixed style={styles.footer}>
                <ReactPDF.View style={styles.signatureContainer}>
                    <ReactPDF.Image
                        style={styles.signatureImage}
                        src={signatureData?.SignatureUrl}
                    />
                    {signatureData?.JobTitle && (
                        <ReactPDF.Text style={styles.signatureTitle}>
                            {signatureData?.JobTitle}
                        </ReactPDF.Text>
                    )}
                    <ReactPDF.View style={styles.divider} />
                    <ReactPDF.View style={styles.signatureTextContainer}>
                        <ReactPDF.View style={styles.signatureContent}>
                            <ReactPDF.Text style={{ ...styles.signatureDoctor }}>
                                {signatureData?.Title} {signatureData?.DoctorEName}
                            </ReactPDF.Text>
                            <ReactPDF.Text style={{ ...styles.signatureSummary }}>
                                {signatureData?.Summary}
                            </ReactPDF.Text>
                        </ReactPDF.View>
                    </ReactPDF.View>
                </ReactPDF.View>
            </ReactPDF.View>
        </>
    );
};

export default React.memo(PDFFooter);
