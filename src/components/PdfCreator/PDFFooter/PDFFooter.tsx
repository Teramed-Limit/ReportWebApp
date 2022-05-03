import React from 'react';

import { Text } from '@react-pdf/renderer';

import { styles } from '../styles/style';

const PDFFooter = () => {
    return (
        <Text
            fixed
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
    );
};

export default PDFFooter;
