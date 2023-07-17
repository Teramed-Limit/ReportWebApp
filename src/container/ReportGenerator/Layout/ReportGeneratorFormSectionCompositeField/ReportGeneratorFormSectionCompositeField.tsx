import React, { CSSProperties, useContext, useRef } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Chip, Stack } from '@mui/material';
import cx from 'classnames';
import { observer } from 'mobx-react';
import * as R from 'ramda';
import { useRecoilState, useSetRecoilState } from 'recoil';

import {
    selectedAttribute,
    selectedAttributePath,
    selectedReportDefine,
} from '../../../../atom/report-generator';
import Button from '../../../../components/UI/Button/Button';
import { NotificationContext } from '../../../../context/notification-context';
import { BaseActionParams } from '../../../../interface/action';
import { CompositeField } from '../../../../interface/composite-field';
import { Field } from '../../../../interface/field';
import FormSectionField from '../../../../layout/FormSectionField/FormSectionField';
import { useReportDataStore } from '../../../../models/useStore';
import {
    compositeFieldSpacing,
    fieldButtonBar,
    fieldFlex,
    fieldGutter,
    fieldSectionContainer,
    fieldSectionValue,
} from '../../../../styles/report/style';
import { noBorderField } from '../../../Report/field/field-type';
import FormSectionFieldLabel from '../../../Report/layout-container/FormSectionFieldLabel/FormSectionFieldLabel';
import ReportDynamicField from '../../../Report/ReportDynamicField/ReportDynamicField';
import { FieldAttributeMapper } from '../../attribute/field/field-attribute-mapper';
import classes from '../ReportGeneratorFormSectionFieldContainer/ReportGeneratorFormSectionFieldContainer.module.scss';

interface FormSectionFieldProps {
    path: (string | number)[];
    field: CompositeField;
    customValueChange?: (id: string, text: string) => void;
    customValueGetter?: (id: string) => string;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}

const ReportGeneratorFormSectionCompositeField = ({
    path,
    field: compositeField,
    customValueChange,
    customValueGetter,
    actionContext,
    prefixComp,
    suffixComp,
}: FormSectionFieldProps) => {
    const { formState, formData, modifiable } = useReportDataStore();

    const actionDispatcher = useContext(actionContext);
    const { openNotification } = useContext(NotificationContext);
    const inputRef = useRef();

    const [attributePath, setAttributePath] = useRecoilState(selectedAttributePath);
    const setSelectedAttribute = useSetRecoilState(selectedAttribute);
    const setFormDefine = useSetRecoilState(selectedReportDefine);

    const onSetAttributePath = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAttributePath(path);

        const attributeInstance = FieldAttributeMapper[compositeField.type](compositeField);
        setSelectedAttribute(attributeInstance);
    };

    const onDeleteSection = (e) => {
        e.stopPropagation();
        setAttributePath([]);
        setFormDefine((prev) => R.dissocPath(path, prev));
    };

    const executeAction = (action: string, actionParams: BaseActionParams) => {
        if (!actionDispatcher[action]) {
            console.error('Action not defined');
            return;
        }

        actionDispatcher[action]({
            ...actionParams,
            ref: inputRef,
            formData: formData.toJSON(),
            compositeField,
            openNotification,
        });
    };

    const buttonBarComponent = (field: Field) =>
        field.buttonBar === undefined ? null : (
            <Stack sx={fieldButtonBar} spacing={1}>
                {field.buttonBar
                    .filter((buttonMeta) => !buttonMeta.hide)
                    .map((buttonMeta) => (
                        <Button
                            key={buttonMeta.id}
                            theme="primary"
                            disabled={buttonMeta?.disable !== 'never' && !modifiable}
                            onClick={() =>
                                executeAction(buttonMeta.action, {
                                    ...buttonMeta.actionParams,
                                    field,
                                })
                            }
                        >
                            {buttonMeta.label}
                        </Button>
                    ))}
            </Stack>
        );

    return (
        <fieldset
            id={`formSectionCompositeContainer__${compositeField.id}`}
            style={
                {
                    ...fieldSectionContainer,
                    flexDirection: compositeField.orientation,
                    padding: fieldGutter,
                } as CSSProperties
            }
            className={cx(classes.fieldset, {
                [classes.focus]: JSON.stringify(path) === JSON.stringify(attributePath),
            })}
            onClick={onSetAttributePath}
        >
            <legend>
                <Chip
                    size="small"
                    color="success"
                    label={compositeField.id}
                    onDelete={onDeleteSection}
                    deleteIcon={<DeleteIcon />}
                />
            </legend>
            {/* Label */}
            <FormSectionFieldLabel
                id={compositeField.id}
                label={compositeField.label}
                labelStyle={compositeField.labelStyle as CSSProperties}
                orientation={compositeField.orientation}
                hint={compositeField.hint}
                hideLabelSection={compositeField.hideLabel}
                hasValidation={!!compositeField.validate}
                prefixComp={prefixComp}
                suffixComp={suffixComp}
            />
            {/* Value */}
            <Stack
                spacing={compositeFieldSpacing}
                sx={[fieldSectionValue, fieldFlex.value[compositeField.orientation]]}
                direction={compositeField.compositeOrientation}
                style={{ flexDirection: compositeField.compositeOrientation }}
            >
                {compositeField.fields.map((field: Field) => {
                    const { isDirty, isValid, errorMessage } = formState.get(field.id) || {
                        isDirty: false,
                        isValid: false,
                        errorMessage: '',
                    };
                    return (
                        <FormSectionField
                            key={`${field.id}`}
                            id={field.id}
                            orientation={field.orientation}
                            readOnly={!!field.readOnly}
                            isDirty={isDirty}
                            isValid={isValid}
                            buttonBarComponent={buttonBarComponent(field)}
                            errorMessage={errorMessage}
                            disabled={!modifiable}
                            noBorder={noBorderField[field.type]}
                            fieldComponent={
                                <ReportDynamicField
                                    field={field}
                                    customValueChange={customValueChange}
                                    customValueGetter={customValueGetter}
                                />
                            }
                        />
                    );
                })}
            </Stack>
        </fieldset>
    );
};

export default observer(ReportGeneratorFormSectionCompositeField);
