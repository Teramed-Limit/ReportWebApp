import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { DoctorSignature } from '../../../interface/doctor-signature';
import { styles } from '../styles/style';

interface Props {
    signatureData: DoctorSignature;
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
                        src={signatureData.signatureUrl}
                    />
                    <ReactPDF.View style={styles.divider} />
                    <ReactPDF.View style={styles.signatureTextContainer}>
                        <ReactPDF.Text style={styles.signatureTitle}>Endoscopist</ReactPDF.Text>
                        <ReactPDF.View style={styles.signatureContent}>
                            <ReactPDF.Text style={{ ...styles.signatureDoctor }}>
                                {signatureData.title} {signatureData.name}
                            </ReactPDF.Text>
                            <ReactPDF.Text style={{ ...styles.signatureSummary }}>
                                Specialist in General Surgery
                            </ReactPDF.Text>
                        </ReactPDF.View>
                    </ReactPDF.View>
                </ReactPDF.View>
            </ReactPDF.View>
        </>
    );
};

export default React.memo(PDFFooter);
