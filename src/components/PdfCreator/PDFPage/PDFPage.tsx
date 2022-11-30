import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { styles } from '../styles/style';

interface Props {
    children: React.ReactNode;
}

const PDFPage = ({ children }: Props) => {
    return (
        <ReactPDF.Page size="A4" style={styles.page}>
            {children}
        </ReactPDF.Page>
    );
};

export default React.memo(PDFPage);
