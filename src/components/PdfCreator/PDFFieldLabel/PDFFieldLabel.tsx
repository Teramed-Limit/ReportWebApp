import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { Field } from '../../../interface/field';
import { fieldFlex, fieldSectionLabel } from '../../../styles/report/style';

interface Props {
    field: Field;
}

const PDFFieldLabel = ({ field }: Props) => {
    return (
        <>
            {!field.hideLabel && (
                <ReactPDF.View
                    style={{
                        ...(fieldSectionLabel as Style),
                        ...(fieldFlex.label[field.orientation] as Style),
                        ...(field.labelStyle || {}),
                    }}
                >
                    {field.label && <ReactPDF.Text>{field.label}</ReactPDF.Text>}
                </ReactPDF.View>
            )}
        </>
    );
};

export default React.memo(PDFFieldLabel);
