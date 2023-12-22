import React from 'react';

import { observer } from 'mobx-react';

import { Field } from '../../../interface/report-field/field';

interface DynamicFieldProps {
    field: Field;
    fieldMapper: { [key: string]: React.ComponentType<any> };
    value: any;
    modifiable: boolean;
    onValueChange?: (value: any) => void;
}

const ReportDynamicField = React.forwardRef(
    ({ field, fieldMapper, value, modifiable, onValueChange }: DynamicFieldProps, ref) => {
        const RenderComponent = fieldMapper[field.type];
        // component does exist
        if (!RenderComponent) {
            console.error(`${JSON.stringify(field)} settings error`);
            return <></>;
        }

        return (
            <RenderComponent
                ref={ref}
                disabled={!modifiable}
                field={field}
                value={value}
                onValueChange={onValueChange}
            />
        );
    },
);

export default observer(ReportDynamicField);
