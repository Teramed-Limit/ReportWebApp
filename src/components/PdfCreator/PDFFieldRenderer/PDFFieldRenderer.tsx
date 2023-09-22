import React from 'react';

import ReactPDF, { Font } from '@react-pdf/renderer';

import { CheckboxCheckedIcon, CheckboxUnCheckedIcon } from '../../../assets';
import { FormFieldType } from '../../../container/Report/FieldComponent/field-type';
import { CodeList } from '../../../interface/code-list';
import { CheckboxField } from '../../../interface/report-field/checkbox-field';
import { DiagramField } from '../../../interface/report-field/diagram-field';
import { Field } from '../../../interface/report-field/field';
import { RadioField } from '../../../interface/report-field/radio-field';
import {
    FilterCondition,
    OptionSource,
    SelectionField,
} from '../../../interface/report-field/selection-field';
import { emptyBaseImage, isEmptyOrNil } from '../../../utils/general';
import { styles } from '../styles/style';

Font.registerHyphenationCallback((word: string) => {
    // 判斷是否為中文字符
    const isChinese = (char: string) => /[\u4e00-\u9fa5]/.test(char);

    if (word.length === 1) {
        return [word];
    }

    // 若字串中含有中文
    if (Array.from(word).some(isChinese)) {
        return Array.from(word)
            .map((char) => [char, ''])
            .reduce((arr, current) => {
                arr.push(...current);
                return arr;
            }, []);
    }

    // 若字串全為英文，則不做斷字處理
    return [word];
});

interface Props {
    field: Field;
    value: string;
    diagramUrl: string;
    getOptions: (source: OptionSource<any>, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFFieldRenderer = ({ field, value, diagramUrl, getOptions }: Props) => {
    const fieldRenderer = (rendererField, rendererValue) => {
        switch (rendererField.type) {
            case FormFieldType.Text:
                return text(rendererField, rendererValue);
            case FormFieldType.TextArea:
                return textArea(rendererField, rendererValue);
            case FormFieldType.Checkbox:
                return checkBox(rendererField, rendererValue);
            case FormFieldType.Radio:
                return radio(rendererField, rendererValue);
            case FormFieldType.CodeListSelection:
                return selection(rendererField, rendererValue);
            case FormFieldType.ReportDiagram:
                return reportDiagram(rendererField);
            default:
                return text(rendererField, rendererValue);
        }
    };

    const selection = (rendererField: SelectionField, rendererValue) => {
        if (rendererField.isMulti) {
            // 一律用Label顯示
            const labelList = (rendererValue as string[])?.map((optValue) => {
                const foundOption: CodeList = getOptions(
                    (rendererField as SelectionField).optionSource,
                ).find((option: CodeList) => option.Value === optValue);
                return foundOption?.Label || '';
            });

            // const newValue = (labelList as string[])?.join('\n') || '';
            const defaultJoinStr = ', ';
            const newValue =
                (labelList as string[])?.join(rendererField?.joinStr || defaultJoinStr) || '';
            return text(rendererField, newValue);
        }

        // 一律用Label顯示
        const foundOption: CodeList = getOptions(
            (rendererField as SelectionField).optionSource,
        ).find((option: CodeList) => option.Value === rendererValue);
        if (!foundOption) return text(rendererField, rendererValue);
        return text(rendererField, foundOption.Label);
    };

    const radio = (rendererField: Field, rendererValue: string) => {
        const foundOption: CodeList = getOptions((rendererField as RadioField).optionSource).find(
            (option: CodeList) => option.Label === rendererValue,
        );

        return text(rendererField, foundOption?.Label);
    };

    const checkBox = (rendererField: Field, rendererValue: string) => {
        return (
            <>
                <ReactPDF.View style={{ ...styles.checkbox }}>
                    {rendererValue === '1' ? (
                        <ReactPDF.Image style={{ ...styles.icon }} src={CheckboxCheckedIcon} />
                    ) : (
                        <ReactPDF.Image style={{ ...styles.icon }} src={CheckboxUnCheckedIcon} />
                    )}
                    {text(rendererField, (rendererField as CheckboxField).checkboxLabel)}
                </ReactPDF.View>
            </>
        );
    };

    const textArea = (rendererField: Field, rendererValue: string) => {
        return <>{text(rendererField, rendererValue)}</>;
    };

    const text = (renderedField: Field, rendererValue: string) => {
        if (isEmptyOrNil(rendererValue)) return <></>;
        return (
            <>
                <ReactPDF.Text style={{ ...(renderedField.valueStyle || {}) }}>
                    {!isEmptyOrNil(rendererValue) && !isEmptyOrNil(renderedField?.prefix) && (
                        <ReactPDF.Text>{renderedField?.prefix}&nbsp;</ReactPDF.Text>
                    )}
                    {rendererValue}
                    {!isEmptyOrNil(rendererValue) && !isEmptyOrNil(renderedField?.suffix) && (
                        <ReactPDF.Text>&nbsp;{renderedField?.suffix}</ReactPDF.Text>
                    )}
                </ReactPDF.Text>
            </>
        );
    };

    const reportDiagram = (renderedField: DiagramField) => {
        return (
            <ReactPDF.Image
                style={{
                    objectFit: 'contain',
                    objectPosition: 'center',
                    width: renderedField?.width ? renderedField.width : 'auto',
                    height: renderedField?.height ? renderedField.height : 'auto',
                }}
                src={diagramUrl || emptyBaseImage()}
            />
        );
    };

    return fieldRenderer(field, value);
};

export default React.memo(PDFFieldRenderer);
