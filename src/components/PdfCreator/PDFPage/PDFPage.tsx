import React from 'react';

import { Page } from '@react-pdf/renderer';

import { styles } from '../styles/style';

interface Props {
    children: React.ReactNode;
}

const PDFPage = ({ children }: Props) => {
    return (
        <Page size="A4" style={styles.page}>
            {children}
        </Page>
    );
};

export default React.memo(PDFPage);
