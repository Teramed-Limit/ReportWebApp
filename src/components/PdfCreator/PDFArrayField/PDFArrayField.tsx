import React from 'react';

import { View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types/style';

import { FormFieldType } from '../../../container/Report/field/field-type';
import { ArrayField } from '../../../interface/array-field';
import { CompositeField } from '../../../interface/composite-field';
import { DocumentData } from '../../../interface/document-data';
import { Field } from '../../../interface/field';
import { FilterCondition } from '../../../interface/selection-field';
import { fieldArrayContainer } from '../../../styles/report/style';
import PDFCompositeField from '../PDFCompositeField/PDFCompositeField';
import PDFField from '../PDFField/PDFField';

interface Props {
    field: ArrayField;
    formData: DocumentData;
    diagramUrl: string;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFArrayField = ({ field, formData, diagramUrl, getOptions }: Props) => {
    const compositeRenderer = (): JSX.Element => {
        const { templateField } = field;
        let maxCountOfArray = 0;
        // 抓出Composite裡面的Fields哪一個陣列長度最長，作為畫面顯示的欄位數量
        (templateField as CompositeField).fields.forEach((compositeChildField) => {
            const count = (formData[compositeChildField.id]?.split('@') as string[])?.length || 0;
            if (maxCountOfArray < count) maxCountOfArray = count;
        });

        const componentList = Array.from(Array(maxCountOfArray).keys());
        return (
            <View
                style={{
                    ...(fieldArrayContainer as Style),
                    ...{ flexDirection: field.orientation },
                }}
            >
                {componentList.map((v, idx) => {
                    const valueFormatter = (compositeField: Field) => {
                        const value = formData[compositeField.id];
                        const valueList = value.split('@') as string[];
                        return valueList?.[idx] || '';
                    };

                    return (
                        <PDFCompositeField
                            key={idx.toString()}
                            field={
                                {
                                    ...templateField,
                                    label: `${templateField.label} ${idx + 1}`,
                                } as CompositeField
                            }
                            valueFormatter={valueFormatter}
                            formData={formData}
                            diagramUrl={diagramUrl}
                            getOptions={getOptions}
                        />
                    );
                })}
            </View>
        );
    };

    const standardRenderer = (): JSX.Element => {
        const { templateField } = field;
        const valueList = (formData?.[templateField.id]?.split('@') as string[]) || [];
        return (
            <>
                {valueList.map((value, idx) => {
                    return (
                        <PDFField
                            key={idx.toString()}
                            field={{
                                ...templateField,
                                label: `${templateField.label} ${idx + 1}`,
                            }}
                            value={value}
                            diagramUrl={diagramUrl}
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
