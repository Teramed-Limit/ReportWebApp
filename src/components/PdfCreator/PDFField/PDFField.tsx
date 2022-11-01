import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { CheckboxCheckedIcon, CheckboxUnCheckedIcon } from '../../../assets';
import { FormFieldType } from '../../../container/Report/field/field-type';
import { CheckboxField } from '../../../interface/checkbox-field';
import { CodeList } from '../../../interface/code-list';
import { CompositeField } from '../../../interface/composite-field';
import { DocumentData } from '../../../interface/document-data';
import { Field } from '../../../interface/field';
import { Option } from '../../../interface/option';
import { RadioField } from '../../../interface/radio-field';
import { FilterCondition, SelectionField } from '../../../interface/selection-field';
import { isEmptyOrNil } from '../../../utils/general';
import PDFBowelScore from '../PDFFieldComponent/PDFBowelScore/PDFBowelScore';
import { styles } from '../styles/style';

interface Props {
    field: Field;
    formData: DocumentData;
    value: string;
    diagramUrl: string;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFField = ({ field, formData, value, diagramUrl, getOptions }: Props) => {
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
            case FormFieldType.ReportDiagram:
                return reportDiagram();
            case FormFieldType.Composite:
                return composite(rendererField);
            case FormFieldType.QualityBowelScore:
                return (
                    <PDFBowelScore
                        bowelData={{
                            BBPS_Right: formData.BBPS_Right || 0,
                            BBPS_Transverse: formData.BBPS_Transverse || 0,
                            BBPS_Left: formData.BBPS_Left || 0,
                        }}
                    />
                );
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

    const composite = (rendererField: Field) => {
        return (
            <View
                style={{
                    ...styles.compositeFieldContainer,
                    ...(rendererField.compositeOrientation === 'vertical'
                        ? { flexDirection: 'column' }
                        : { flexDirection: 'row' }),
                }}
            >
                <>
                    {(rendererField as CompositeField).fields.map((compositeChildField) => {
                        return (
                            <React.Fragment key={compositeChildField.id}>
                                {fieldRenderer(
                                    compositeChildField,
                                    formData[compositeChildField.id],
                                )}
                            </React.Fragment>
                        );
                    })}
                </>
            </View>
        );
    };

    const reportDiagram = () => {
        return <Image src={diagramUrl} />;
    };

    return (
        <>
            {/* Label */}
            {labelRenderer(field)}
            {/* Value */}
            <View
                style={{
                    ...(field.orientation === 'vertical'
                        ? { ...styles.textValueVertical }
                        : { ...styles.textValueHorizontal }),
                }}
            >
                {fieldRenderer(field, value)}
            </View>
        </>
    );
};

export default React.memo(PDFField);
