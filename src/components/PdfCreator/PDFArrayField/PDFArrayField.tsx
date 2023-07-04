import React from 'react';

import ReactPDF from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { FormFieldType } from '../../../container/Report/field/field-type';
import { ArrayField } from '../../../interface/array-field';
import { CompositeField } from '../../../interface/composite-field';
import { DocumentData } from '../../../interface/document-data';
import { FilterCondition } from '../../../interface/selection-field';
import { fieldArrayContainer } from '../../../styles/report/style';
import PDFCompositeField from '../PDFCompositeField/PDFCompositeField';
import PDFField from '../PDFField/PDFField';

interface Props {
    field: ArrayField;
    formData: DocumentData;
    diagramUrl: string;
    pdfStyle: {
        imagePerRow: number;
        imagePageBreak: boolean;
        fontSize: number;
        pagePadding: number;
    };
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFArrayField = ({ field, formData, diagramUrl, pdfStyle, getOptions }: Props) => {
    const compositeRenderer = (): JSX.Element => {
        const { templateField } = field;
        const valueList = formData[field.id];
        return (
            <ReactPDF.View
                style={{
                    ...(fieldArrayContainer as Style),
                    ...{ flexDirection: field.orientation },
                }}
            >
                {valueList.map((value, idx) => {
                    const key = `${templateField.id}_${idx}`;
                    return (
                        <PDFCompositeField
                            key={key}
                            field={
                                {
                                    ...templateField,
                                    label: `${templateField.label} ${idx + 1}`,
                                } as CompositeField
                            }
                            formData={valueList[idx]}
                            diagramUrl={diagramUrl}
                            pdfStyle={pdfStyle}
                            getOptions={getOptions}
                        />
                    );
                })}
            </ReactPDF.View>
        );
    };

    const standardRenderer = (): JSX.Element => {
        const { templateField } = field;
        const valueList = formData[field.id];
        return (
            <>
                {valueList.map((value, idx) => {
                    const key = `${templateField.id}_${idx}`;
                    return (
                        <PDFField
                            key={key}
                            field={{
                                ...templateField,
                                label: `${templateField.label} ${idx + 1}`,
                            }}
                            value={value?.[templateField.id] || ''}
                            diagramUrl={diagramUrl}
                            pdfStyle={pdfStyle}
                            getOptions={getOptions}
                        />
                    );
                })}
            </>
        );
    };

    const fieldRenderer = (): JSX.Element => {
        switch (field.templateField.type) {
            case FormFieldType.Composite:
                return compositeRenderer();
            default:
                return standardRenderer();
        }
    };

    return fieldRenderer();
};

export default React.memo(PDFArrayField);
