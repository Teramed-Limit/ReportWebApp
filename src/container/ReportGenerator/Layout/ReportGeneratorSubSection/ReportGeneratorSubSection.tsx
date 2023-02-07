import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Chip } from '@mui/material';
import cx from 'classnames';
import * as R from 'ramda';
import { useRecoilState, useSetRecoilState } from 'recoil';

import {
    selectedAttribute,
    selectedAttributePath,
    selectedReportDefine,
} from '../../../../atom/report-generator';
import { ArrayField } from '../../../../interface/array-field';
import { CompositeField } from '../../../../interface/composite-field';
import { SubSection } from '../../../../interface/define';
import { reportSubsection } from '../../../../styles/report/style';
import { FormFieldType } from '../../../Report/field/field-type';
import { SubSectionAttribute } from '../../attribute/SubSectionAttribute';
import ReportGeneratorFormSectionArrayField from '../ReportGeneratorFormSectionArrayField/ReportGeneratorFormSectionArrayField';
import ReportGeneratorFormSectionCompositeField from '../ReportGeneratorFormSectionCompositeField/ReportGeneratorFormSectionCompositeField';
import ReportGeneratorFormSectionFieldContainer from '../ReportGeneratorFormSectionFieldContainer/ReportGeneratorFormSectionFieldContainer';
import classes from './ReportGeneratorSubSection.module.scss';

interface Props {
    subSection: SubSection;
    path: (string | number)[];
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ReportGeneratorSubSection = ({ subSection, path, actionContext }: Props) => {
    const [attributePath, setAttributePath] = useRecoilState(selectedAttributePath);
    const setSelectedAttribute = useSetRecoilState(selectedAttribute);
    const setFormDefine = useSetRecoilState(selectedReportDefine);

    const onSetAttributePath = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAttributePath(path);
        setSelectedAttribute(new SubSectionAttribute(subSection));
    };

    const onDeleteSection = (e) => {
        e.stopPropagation();
        setAttributePath([]);
        setFormDefine((prev) => R.dissocPath(path, prev));
    };

    return (
        <fieldset
            role="button"
            tabIndex={0}
            id={subSection.id}
            style={{ ...reportSubsection, maxWidth: subSection?.maxWidth }}
            className={cx(classes.fieldset, {
                [classes.focus]: JSON.stringify(path) === JSON.stringify(attributePath),
            })}
            onClick={onSetAttributePath}
        >
            <legend>
                <Chip
                    size="small"
                    color="secondary"
                    label={subSection.id}
                    onDelete={onDeleteSection}
                    deleteIcon={<DeleteIcon />}
                />
            </legend>
            {subSection.fields.map((field, idx) => {
                switch (field.type) {
                    case FormFieldType.Composite:
                        return (
                            <ReportGeneratorFormSectionCompositeField
                                path={[...path, 'fields', idx]}
                                key={field.id}
                                field={field as CompositeField}
                                actionContext={actionContext}
                            />
                        );
                    case FormFieldType.Array:
                        return (
                            <ReportGeneratorFormSectionArrayField
                                key={field.id}
                                path={[...path, 'fields', idx]}
                                field={field as ArrayField}
                                actionContext={actionContext}
                            />
                        );
                    default:
                        return (
                            <ReportGeneratorFormSectionFieldContainer
                                key={field.id}
                                path={[...path, 'fields', idx]}
                                field={field}
                                actionContext={actionContext}
                            />
                        );
                }
            })}
        </fieldset>
    );
};

export default ReportGeneratorSubSection;
