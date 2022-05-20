import React from 'react';

import { Text, View, Image } from '@react-pdf/renderer';

import { CheckboxCheckedIcon, CheckboxUnCheckedIcon } from '../../../assets';
import { FormFieldType } from '../../../container/Report/field/field-type';
import { CheckboxField } from '../../../interface/checkbox-field';
import { DocumentData } from '../../../interface/document-data';
import { Field } from '../../../interface/field';
import { Option } from '../../../interface/option';
import { RadioField } from '../../../interface/radio-field';
import { FilterCondition } from '../../../interface/selection-field';
import PDFBowelScore from '../PDFFieldComponent/PDFBowelScore/PDFBowelScore';
import { styles } from '../styles/style';

interface Props {
    field: Field;
    formData: DocumentData;
    value: string;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFField = ({ field, formData, value, getOptions }: Props) => {
    const renderer = () => {
        switch (field.type) {
            case FormFieldType.Checkbox:
                return checkBox();
            case FormFieldType.Radio:
                return radio();
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
                return text();
        }
    };

    const radio = () => {
        const foundOption: Option = getOptions((field as RadioField<any>).optionSource.source).find(
            (option: Option) => option.Name === value,
        );

        return <>{baseTextContainer(<>{foundOption?.Code}</>)}</>;
    };

    const checkBox = () => {
        return (
            <>
                <View style={{ marginLeft: '8px', alignItems: 'center' }}>
                    {value === '1' ? (
                        <Image style={{ ...styles.icon }} src={CheckboxCheckedIcon} />
                    ) : (
                        <Image style={{ ...styles.icon }} src={CheckboxUnCheckedIcon} />
                    )}
                </View>
                {baseTextContainer(<>{(field as CheckboxField).checkboxLabel}</>)}
            </>
        );
    };

    const text = () => {
        return baseTextContainer(
            <>
                {value} {field.suffix}
            </>,
        );
    };

    const baseTextContainer = (element: React.ReactNode) => {
        return (
            <Text
                style={{
                    ...styles.textValue,
                    ...(field.orientation === 'vertical'
                        ? { ...styles.textValueVertical }
                        : { ...styles.textValueHorizontal }),
                }}
            >
                {element}
            </Text>
        );
    };

    return (
        <>
            {/* Label */}
            {!field.hideLabel && (
                <Text
                    style={{
                        ...styles.label,
                        ...(field.orientation === 'vertical'
                            ? { ...styles.labelVertical }
                            : { ...styles.labelHorizontal }),
                    }}
                >
                    {field.label} {field.label && ':'}
                </Text>
            )}
            {renderer()}
        </>
    );
};

export default React.memo(PDFField);
