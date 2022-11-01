import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { CheckboxCheckedIcon, CheckboxUnCheckedIcon } from '../../../assets';
import { FormFieldType } from '../../../container/Report/field/field-type';
import { ArrayField } from '../../../interface/array-field';
import { CheckboxField } from '../../../interface/checkbox-field';
import { CodeList } from '../../../interface/code-list';
import { CompositeField } from '../../../interface/composite-field';
import { DocumentData } from '../../../interface/document-data';
import { Field } from '../../../interface/field';
import { Option } from '../../../interface/option';
import { RadioField } from '../../../interface/radio-field';
import { FilterCondition, SelectionField } from '../../../interface/selection-field';
import { isEmptyOrNil } from '../../../utils/general';
import { styles } from '../styles/style';

interface Props {
    field: ArrayField;
    formData: DocumentData;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFArrayField = ({ field, formData, getOptions }: Props) => {
    const arrayFieldRenderer = (rendererField: ArrayField) => {
        // Normal field
        if (rendererField.templateField.type !== FormFieldType.Composite) {
            const value = formData[rendererField.templateField.id];
            const valueList = value.split('@') as string[];
            return (
                <>
                    {valueList.map((rendererValue, idx) => {
                        return (
                            <React.Fragment key={idx.toString()}>
                                {/* Label */}
                                {labelRenderer(rendererField.templateField)}
                                {/* Value */}
                                <View
                                    style={{
                                        ...(field.orientation === 'vertical'
                                            ? { ...styles.textValueVertical }
                                            : { ...styles.textValueHorizontal }),
                                    }}
                                >
                                    {fieldRenderer(rendererField.templateField.id, rendererValue)}
                                </View>
                            </React.Fragment>
                        );
                    })}
                </>
            );
        }
        // Composite field
        // find max of length
        let maxCountOfArray = 0;
        (rendererField.templateField as CompositeField).fields.forEach((compositeChildField) => {
            const count = (formData[compositeChildField.id].split('@') as string[]).length;
            if (maxCountOfArray < count) maxCountOfArray = count;
        });

        const labelArray = Array.from(Array(maxCountOfArray).keys());
        return (
            <>
                {labelArray.map((v, idx) => {
                    return (
                        <View
                            key={idx.toString()}
                            style={{
                                ...styles.fieldSection,
                                flexDirection: field.orientation === 'vertical' ? 'column' : 'row',
                            }}
                        >
                            {/* label */}
                            {labelRenderer({
                                ...rendererField.templateField,
                                label: `${rendererField.templateField.label} ${idx + 1}`,
                            })}
                            {/* value */}
                            <View
                                style={{
                                    ...(rendererField.orientation === 'vertical'
                                        ? { ...styles.textValueVertical }
                                        : { ...styles.textValueHorizontal }),
                                }}
                            >
                                {/* composite container */}
                                <View
                                    style={{
                                        ...styles.compositeFieldContainer,
                                        ...(rendererField.compositeOrientation === 'vertical'
                                            ? { flexDirection: 'column' }
                                            : { flexDirection: 'row' }),
                                    }}
                                >
                                    {/* composite value */}
                                    {(rendererField.templateField as CompositeField).fields.map(
                                        (compositeField, compositeFieldIdx) => {
                                            const value = formData[compositeField.id];
                                            const valueList = value.split('@') as string[];
                                            return (
                                                <React.Fragment key={compositeFieldIdx.toString()}>
                                                    {fieldRenderer(compositeField, valueList[idx])}
                                                </React.Fragment>
                                            );
                                        },
                                    )}
                                </View>
                            </View>
                        </View>
                    );
                })}
            </>
        );
    };

    const fieldRenderer = (rendererField, rendererValue) => {
        switch (rendererField.type) {
            case FormFieldType.Text:
                return text(rendererField, rendererValue);
            case FormFieldType.Checkbox:
                return checkBox(rendererField, rendererValue);
            case FormFieldType.Radio:
                return radio(rendererField, rendererValue);
            case FormFieldType.CodeListSelection:
                return selection(rendererField, rendererValue);
            default:
                return text(rendererField, rendererValue);
        }
    };

    const labelRenderer = (rendererField) => {
        return (
            !rendererField.hideLabel && (
                <Text
                    style={{
                        ...styles.label,
                        ...(rendererField.orientation === 'vertical'
                            ? { ...styles.labelVertical }
                            : { ...styles.labelHorizontal }),
                        ...(rendererField.labelStyle || {}),
                    }}
                >
                    {rendererField.label}
                </Text>
            )
        );
    };

    const selection = (rendererField: SelectionField<any>, rendererValue) => {
        if (rendererField.isMulti) {
            const newValue = (rendererValue as string[]).join('\r\n');
            return text(rendererField, newValue);
        }

        // 一律用Label顯示
        const foundOption: CodeList = getOptions(
            (rendererField as SelectionField<any>).optionSource.source,
        ).find((option: CodeList) => option.Value === rendererValue);
        if (!foundOption) return text(rendererField, rendererValue);
        return text(rendererField, foundOption.Label);
    };

    const radio = (rendererField, rendererValue) => {
        const foundOption: Option = getOptions(
            (rendererField as RadioField<any>).optionSource.source,
        ).find((option: Option) => option.Name === rendererValue);

        return text(rendererField, foundOption?.Code);
    };

    const checkBox = (rendererField, rendererValue) => {
        return (
            <>
                <View style={{ marginLeft: '8px', alignItems: 'center' }}>
                    {rendererValue === '1' ? (
                        <Image style={{ ...styles.icon }} src={CheckboxCheckedIcon} />
                    ) : (
                        <Image style={{ ...styles.icon }} src={CheckboxUnCheckedIcon} />
                    )}
                </View>
                {text(rendererField, (rendererField as CheckboxField).checkboxLabel)}
            </>
        );
    };

    const text = (renderedField: Field, rendererValue: string) => {
        return (
            <Text style={styles.textValue}>
                {!isEmptyOrNil(rendererValue) && renderedField?.prefix} {rendererValue}{' '}
                {!isEmptyOrNil(rendererValue) && renderedField?.suffix}
            </Text>
        );
    };

    return <View style={styles.arrayFieldContainer}>{arrayFieldRenderer(field)}</View>;
};

export default React.memo(PDFArrayField);
