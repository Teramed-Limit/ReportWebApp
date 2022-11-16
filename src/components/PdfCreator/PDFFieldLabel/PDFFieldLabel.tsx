import React from 'react';

import { Text, View } from '@react-pdf/renderer';
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
                <View
                    style={{
                        ...(fieldSectionLabel as Style),
                        ...(fieldFlex.label[field.orientation] as Style),
                        ...(field.labelStyle || {}),
                    }}
                >
                    {field.label && <Text>{field.label}</Text>}
                </View>
            )}
        </>
    );
};

export default React.memo(PDFFieldLabel);
