import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { FormFieldType } from '../../../container/Report/FieldComponent/field-type';
import { GenerateArrayFieldId } from '../../../container/Report/Layout/InputArrayField/InputArrayField';
import { DocumentData } from '../../../interface/document-data';
import { ArrayField } from '../../../interface/report-field/array-field';
import { CompositeField } from '../../../interface/report-field/composite-field';
import { FilterCondition, OptionSource } from '../../../interface/report-field/selection-field';
import PDFCompositeField from '../PDFCompositeField/PDFCompositeField';
import PDFField from '../PDFField/PDFField';

interface Props {
    field: ArrayField;
    formData: DocumentData;
    diagramUrl: string;
    getOptions: (source: OptionSource<any>, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFArrayField = ({ field, formData, diagramUrl, getOptions }: Props) => {
    const fieldRenderer = (): JSX.Element => {
        const { templateField } = field;
        const valueList = formData[field.id] || [];
        switch (field.templateField.type) {
            case FormFieldType.Composite:
                return (
                    <>
                        {valueList?.map((_, idx) => {
                            const key = GenerateArrayFieldId(templateField.id, idx);
                            return (
                                <PDFCompositeField
                                    key={key}
                                    field={
                                        {
                                            ...templateField,
                                            label: `${templateField.label} ${idx + 1}`,
                                            orientation: field.orientation,
                                        } as CompositeField
                                    }
                                    formData={valueList[idx]}
                                    diagramUrl={diagramUrl}
                                    getOptions={getOptions}
                                />
                            );
                        })}
                    </>
                );
            default:
                return (
                    <>
                        {valueList?.map((value, idx) => {
                            const key = GenerateArrayFieldId(templateField.id, idx);
                            const val = value?.[key] || '';
                            return (
                                <PDFField
                                    key={key}
                                    field={{
                                        ...templateField,
                                        label: `${templateField.label} ${idx + 1}`,
                                        orientation: field.orientation,
                                    }}
                                    value={val}
                                    diagramUrl={diagramUrl}
                                    getOptions={getOptions}
                                />
                            );
                        })}
                    </>
                );
        }
    };

    return (
        <>
            <ReactPDF.View style={{ flexDirection: field.arrayOrientation || 'column' }}>
                {fieldRenderer()}
            </ReactPDF.View>
        </>
    );
};

export default React.memo(PDFArrayField);
