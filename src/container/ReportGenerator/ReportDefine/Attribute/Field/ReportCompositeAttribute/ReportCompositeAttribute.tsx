import React from 'react';

import * as R from 'ramda';
import { useRecoilCallback } from 'recoil';

import { CompositeFieldAttribute } from './CompositeFieldAttribute';
import ReportCompositeFieldsAttribute from './ReportCompositeFieldsAttribute/ReportCompositeFieldsAttribute';
import {
    selectedAttributeAtom,
    selectedReportDefine,
} from '../../../../../../atom/report-generator';
import AttributeList from '../../../../../../components/AttributeList/AttributeList';
import { FormFieldType } from '../../../../../Report/FieldComponent/field-type';
import OrientationSelection from '../../Common/OrientationSelection/OrientationSelection';
import { FieldAttributeMapper } from '../../report-define-attributes-mapper';
import { RenderComponentAttributeProps } from '../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

const ReportCompositeAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
}: RenderComponentAttributeProps<CompositeFieldAttribute>) => {
    // 新增CompositeField內的Field
    const addField = useRecoilCallback(({ snapshot, set }) => () => {
        let newAttribute = attribute;
        if (!attribute.fields) newAttribute = new CompositeFieldAttribute(attribute);

        const newField = FieldAttributeMapper[FormFieldType.Text]({
            id: `${newAttribute.id}_Child${newAttribute.fields.length + 1}`,
            type: FormFieldType.Text,
            label: `label`,
            orientation: 'row',
        });

        const compositeFields = R.insert(newAttribute.fields.length, newField, newAttribute.fields);

        const currentReportDefine = snapshot.getLoadable(selectedReportDefine).contents;
        const updatedReportDefine = R.assocPath(
            [...attrPath, 'fields'],
            compositeFields,
            currentReportDefine,
        );

        set(selectedReportDefine, updatedReportDefine);
        set(
            selectedAttributeAtom,
            R.path([...attrPath, 'fields'].slice(0, 6), updatedReportDefine),
        );
    });

    // 刪除CompositeField內的Field
    const deleteField = useRecoilCallback(({ snapshot, set }) => (index: number) => {
        const compositeFields = R.remove(index, 1, attribute.fields);

        const currentReportDefine = snapshot.getLoadable(selectedReportDefine).contents;
        const updatedReportDefine = R.assocPath(
            [...attrPath, 'fields'],
            compositeFields,
            currentReportDefine,
        );

        set(selectedReportDefine, updatedReportDefine);
        set(
            selectedAttributeAtom,
            R.path([...attrPath, 'fields'].slice(0, 6), updatedReportDefine),
        );
    });

    return (
        <>
            <AttributeList
                defaultExpanded={false}
                attribute={new CompositeFieldAttribute(attribute)}
                setAttribute={onSetAttribute}
                includeAttribute={['compositeOrientation', 'fields']}
                filterType={'include'}
                attributeComponentMapper={{
                    compositeOrientation: OrientationSelection,
                    fields: (
                        <ReportCompositeFieldsAttribute
                            attrPath={[...attrPath, 'fields']}
                            attribute={attribute.fields}
                            onSetAttribute={onSetAttribute}
                            addField={addField}
                            deleteField={deleteField}
                        />
                    ),
                }}
            />
        </>
    );
};

export default React.memo(ReportCompositeAttribute);
