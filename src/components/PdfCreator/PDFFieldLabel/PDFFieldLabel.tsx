import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { noLabelField } from '../../../container/Report/FieldComponent/field-type';
import { Field } from '../../../interface/report-field/field';

interface Props {
    field: Field;
}

const PDFFieldLabel = ({ field }: Props) => {
    return (
        <>
            {!field.hideLabel && !noLabelField[field.type] && (
                <ReactPDF.View style={{ minWidth: field?.labelWidth || '35%' }}>
                    {field.label && (
                        <ReactPDF.Text style={field.labelStyle || {}}>{field.label}</ReactPDF.Text>
                    )}
                </ReactPDF.View>
            )}
        </>
    );
};

export default React.memo(PDFFieldLabel);
