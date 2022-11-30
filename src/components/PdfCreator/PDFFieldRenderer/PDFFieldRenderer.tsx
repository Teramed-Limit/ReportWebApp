import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { CheckboxCheckedIcon, CheckboxUnCheckedIcon } from '../../../assets';
import { FormFieldType } from '../../../container/Report/field/field-type';
import { CheckboxField } from '../../../interface/checkbox-field';
import { CodeList } from '../../../interface/code-list';
import { Field } from '../../../interface/field';
import { Option } from '../../../interface/option';
import { RadioField } from '../../../interface/radio-field';
import { FilterCondition, SelectionField } from '../../../interface/selection-field';
import { isEmptyOrNil } from '../../../utils/general';
import { styles } from '../styles/style';

ReactPDF.Font.registerHyphenationCallback((word) => [word]);

interface Props {
    field: Field;
    value: string;
    diagramUrl: string;
    getOptions: (source: string, filterCondition?: FilterCondition | undefined) => any[];
}

const PDFFieldRenderer = ({ field, value, diagramUrl, getOptions }: Props) => {
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
            default:
                return text(rendererField, rendererValue);
        }
    };

    const selection = (rendererField: SelectionField<any>, rendererValue) => {
        if (rendererField.isMulti) {
            // 一律用Label顯示
            const labelList = (rendererValue as string[])?.map((optValue) => {
                const foundOption: CodeList = getOptions(
                    (rendererField as SelectionField<any>).optionSource.source,
                ).find((option: CodeList) => option.Value === optValue);
                return foundOption?.Label || '';
            });

            const newValue = (labelList as string[])?.join('\r\n') || '';
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
                <ReactPDF.View style={{ marginLeft: '8px', alignItems: 'center' }}>
                    {rendererValue === '1' ? (
                        <ReactPDF.Image style={{ ...styles.icon }} src={CheckboxCheckedIcon} />
                    ) : (
                        <ReactPDF.Image style={{ ...styles.icon }} src={CheckboxUnCheckedIcon} />
                    )}
                </ReactPDF.View>
                {text(rendererField, (rendererField as CheckboxField).checkboxLabel)}
            </>
        );
    };

    const text = (renderedField: Field, rendererValue: string) => {
        return (
            <>
                <ReactPDF.Text>
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

    const reportDiagram = () => {
        return <ReactPDF.Image src={diagramUrl} />;
    };

    return fieldRenderer(field, value);
};

export default React.memo(PDFFieldRenderer);
