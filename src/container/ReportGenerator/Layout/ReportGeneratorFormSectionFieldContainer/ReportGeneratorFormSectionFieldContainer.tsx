import React, { CSSProperties, useContext, useRef } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Chip, Stack } from '@mui/material';
import cx from 'classnames';
import { observer } from 'mobx-react';
import * as R from 'ramda';
import { useRecoilState, useSetRecoilState } from 'recoil';

import classes from './ReportGeneratorFormSectionFieldContainer.module.scss';
import {
    selectedAttribute,
    selectedAttributePath,
    selectedReportDefine,
} from '../../../../atom/report-generator';
import Button from '../../../../components/UI/Button/Button';
import { NotificationContext } from '../../../../context/notification-context';
import { BaseActionParams } from '../../../../interface/action';
import { Field } from '../../../../interface/field';
import FormSectionField from '../../../../layout/FormSectionField/FormSectionField';
import { useReportDataStore } from '../../../../models/useStore';
import {
    fieldButtonBar,
    fieldGutter,
    fieldSectionContainer,
} from '../../../../styles/report/style';
import { noBorderField } from '../../../Report/field/field-type';
import FormSectionFieldLabel from '../../../Report/layout-container/FormSectionFieldLabel/FormSectionFieldLabel';
import ReportDynamicField from '../../../Report/ReportDynamicField/ReportDynamicField';
import { FieldAttributeMapper } from '../../attribute/field/field-attribute-mapper';

interface FormSectionFieldProps {
    field: Field;
    path: (string | number)[];
    customValueChange?: (id: string, text: string) => void;
    customValueGetter?: (id: string) => string;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
    prefixComp?: JSX.Element | null;
    suffixComp?: JSX.Element | null;
}

const ReportGeneratorFormSectionFieldContainer = ({
    field,
    path,
    customValueChange,
    customValueGetter,
    actionContext,
    prefixComp,
    suffixComp,
}: FormSectionFieldProps) => {
    const actionDispatcher = useContext(actionContext);
    const { openNotification } = useContext(NotificationContext);
    const inputRef = useRef();
    const { formState, formData, modifiable } = useReportDataStore();
    const { isDirty, isValid, errorMessage } = formState.get(field.id) || {
        isDirty: false,
        isValid: false,
        errorMessage: '',
    };

    const [attributePath, setAttributePath] = useRecoilState(selectedAttributePath);
    const setSelectedAttribute = useSetRecoilState(selectedAttribute);
    const setFormDefine = useSetRecoilState(selectedReportDefine);

    const onSetAttributePath = (e) => {
        e.stopPropagation();
        setAttributePath(path);

        const attributeInstance = FieldAttributeMapper[field.type](field);
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
            field,
            openNotification,
        });
    };

    const buttonBarComponent =
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
                                executeAction(buttonMeta.action, buttonMeta.actionParams)
                            }
                        >
                            {buttonMeta.label}
                        </Button>
                    ))}
            </Stack>
        );

    return (
        <>
            <fieldset
                id={`formSectionFieldContainer__${field.id}`}
                style={
                    {
                        ...fieldSectionContainer,
                        flexDirection: field.orientation,
                        padding: fieldGutter,
                        opacity: field.hide ? 0.4 : 1,
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
                        label={field.id}
                        onDelete={onDeleteSection}
                        deleteIcon={<DeleteIcon />}
                    />
                </legend>
                {/* Label */}
                <FormSectionFieldLabel
                    id={field.id}
                    label={field.label}
                    labelStyle={field.labelStyle as CSSProperties}
                    orientation={field.orientation}
                    hint={field.hint}
                    hideLabelSection={field.hideLabel}
                    hasValidation={!!field.validate}
                    prefixComp={prefixComp}
                    suffixComp={suffixComp}
                />
                {/* Value */}
                <FormSectionField
                    id={field.id}
                    valueStyle={field.valueStyle as CSSProperties}
                    orientation={field.orientation}
                    readOnly={!!field.readOnly}
                    isDirty={isDirty}
                    isValid={isValid}
                    errorMessage={errorMessage}
                    disabled={!modifiable}
                    noBorder={noBorderField[field.type]}
                    buttonBarComponent={buttonBarComponent}
                    fieldComponent={
                        <ReportDynamicField
                            ref={inputRef}
                            field={field}
                            customValueChange={customValueChange}
                            customValueGetter={customValueGetter}
                        />
                    }
                />
            </fieldset>
        </>
    );
};

export default observer(ReportGeneratorFormSectionFieldContainer);
