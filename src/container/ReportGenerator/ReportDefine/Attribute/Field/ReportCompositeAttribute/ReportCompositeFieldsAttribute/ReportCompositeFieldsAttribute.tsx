import React from 'react';

import { Button } from '@mui/material';

import { InnerCompositeFieldAttribute } from './ReportBaseInnerCompositeFieldAttribute/InnerCompositeFieldAttribute';
import ReportBaseInnerCompositeFieldAttribute from './ReportBaseInnerCompositeFieldAttribute/ReportBaseInnerCompositeFieldAttribute';
import { ReportDefineAttributesMapper } from '../../../report-define-attributes-mapper';
import { RenderComponentAttributeProps } from '../../../ReportDefineAttributeEditor/ReportDefineAttributeEditor';

interface AdditionProps {
    addField: () => void;
    deleteField: (index: number) => void;
}

type Props = AdditionProps & RenderComponentAttributeProps<InnerCompositeFieldAttribute[]>;

const ReportCompositeFieldsAttribute = ({
    attrPath,
    attribute,
    onSetAttribute,
    deleteField,
    addField,
}: Props) => {
    return (
        <>
            {attribute?.map((field, index) => {
                const RenderAttribute = ReportDefineAttributesMapper[field.type];
                if (!RenderAttribute) {
                    console.error(`No attribute component for ${field.type}`);
                    return null;
                }
                return (
                    <React.Fragment key={field.id}>
                        <ReportBaseInnerCompositeFieldAttribute
                            attrPath={[...attrPath, index]}
                            attribute={new InnerCompositeFieldAttribute(field)}
                            onSetAttribute={(
                                attributePath: (number | string)[],
                                attributeValue: number | string | boolean,
                            ) => {
                                onSetAttribute(['fields', index, ...attributePath], attributeValue);
                            }}
                        />
                        <RenderAttribute
                            attrPath={[...attrPath, index]}
                            attribute={field}
                            onSetAttribute={(
                                attributePath: (number | string)[],
                                attributeValue: number | string | boolean,
                            ) => {
                                onSetAttribute(['fields', index, ...attributePath], attributeValue);
                            }}
                        ></RenderAttribute>
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={() => deleteField(index)}
                        >
                            Delete Field
                        </Button>
                    </React.Fragment>
                );
            })}
            <Button
                sx={{ position: 'sticky', bottom: '0', 'z-index': 1000 }}
                variant="contained"
                fullWidth
                color="primary"
                onClick={() => addField()}
            >
                Add Field
            </Button>
        </>
    );
};

export default React.memo(ReportCompositeFieldsAttribute);
