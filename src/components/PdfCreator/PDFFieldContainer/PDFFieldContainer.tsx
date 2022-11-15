import React from 'react';

import { View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { fieldSectionContainer } from '../../../styles/report/style';
import { fontSize } from '../styles/style';

interface Props {
    orientation: 'column' | 'row';
    children: React.ReactNode;
}

const PDFFieldContainer = ({ orientation, children }: Props) => {
    return (
        <View
            style={{
                ...(fieldSectionContainer as Style),
                ...{ flexDirection: orientation },
                ...{ fontSize },
            }}
        >
            {children}
        </View>
    );
};

export default React.memo(PDFFieldContainer);
