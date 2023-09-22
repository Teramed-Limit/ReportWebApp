import React from 'react';

import { Chip } from '@mui/material';
import { observer } from 'mobx-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
    selectedAttributeAtom,
    selectedAttributePathAtom,
    selectedAttributeTypeAtom,
    selectedDefineType,
    selectedFieldsAtom,
} from '../../../../../atom/report-generator';
import { Section } from '../../../../../interface/define';
import { ReportActionContext } from '../../../../Report/Context/reportActionProvider';
import { LayoutType } from '../../../../Report/FieldComponent/field-type';
import FieldsetTemplate from '../FieldsetTemplate/FieldsetTemplate';
import ReportGeneratorSection from '../ReportGeneratorSection/ReportGeneratorSection';

interface Props {
    sections: Section[];
    showGuideLine: boolean;
}

const ReportGeneratorPage = ({ sections, showGuideLine }: Props) => {
    const setSelectedAttribute = useSetRecoilState(selectedAttributeAtom);
    const setSelectedAttributeType = useSetRecoilState(selectedAttributeTypeAtom);
    const setAttributePath = useSetRecoilState(selectedAttributePathAtom);
    const setSelectedFields = useSetRecoilState(selectedFieldsAtom);
    const setDefineType = useSetRecoilState(selectedDefineType);
    const selectedFieldList = useRecoilValue(selectedFieldsAtom);

    const onSetAttributePath = (e) => {
        e.stopPropagation();
        setDefineType('FormDefine');
        setAttributePath([]);
        setSelectedAttribute(sections);
        setSelectedAttributeType(LayoutType.Page);
        setSelectedFields(new Set<string>().add(JSON.stringify(['page'])));
    };

    return (
        <FieldsetTemplate
            id="page"
            style={{
                margin: '4px 0',
                display: 'flex',
                flexWrap: 'wrap',
                width: '100%',
            }}
            showGuideLine={showGuideLine}
            isFocus={selectedFieldList.has(JSON.stringify(['page']))}
            legendComp={<Chip size="small" color="warning" label="page" />}
            onClick={(e) => {
                onSetAttributePath(e);
            }}
        >
            {sections?.map((section: Section, idx: number) => (
                <ReportGeneratorSection
                    key={section.id}
                    showGuideLine={showGuideLine}
                    path={['sections', idx]}
                    section={section}
                    actionContext={ReportActionContext}
                />
            ))}
        </FieldsetTemplate>
    );
};

export default observer(ReportGeneratorPage);
