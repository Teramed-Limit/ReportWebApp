import React from 'react';

import { View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { Field } from '../../../interface/field';
import { FilterCondition } from '../../../interface/selection-field';
import { fieldFlex, fieldSectionValue } from '../../../styles/report/style';
import PDFFieldContainer from '../PDFFieldContainer/PDFFieldContainer';
import PDFFieldLabel from '../PDFFieldLabel/PDFFieldLabel';
import PDFFieldRenderer from '../PDFFieldRenderer/PDFFieldRenderer';

interface Props {
    field: Field;
    value: string;
    diagramUrl: string;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFField = ({ field, value, diagramUrl, getOptions }: Props) => {
    return (
        <PDFFieldContainer orientation={field.orientation}>
            {/* Label */}
            <PDFFieldLabel field={field} />
            {/* Value */}
            <View
                style={{
                    ...(fieldSectionValue as Style),
                    ...(fieldFlex.value[field.orientation] as Style),
                }}
            >
                <PDFFieldRenderer
                    field={field}
                    value={value}
                    diagramUrl={diagramUrl}
                    getOptions={getOptions}
                />
            </View>
        </PDFFieldContainer>
    );
};

export default React.memo(PDFField);
