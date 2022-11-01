import React from 'react';

import { observer } from 'mobx-react';

import { Field } from '../../../interface/field';
import { useReportDataStore } from '../../../models/useStore';
import { FieldMapper } from '../field/field-mapper';

interface DynamicFieldProps {
    field: Field;
    customValueGetter?: (id: string) => string;
    customValueChange?: (id: string, text: string) => void;
}

const ReportDynamicField = React.forwardRef(
    ({ field, customValueGetter, customValueChange }: DynamicFieldProps, ref) => {
        const store = useReportDataStore();
        const { formData, valueChanged, reportDisabled } = store;

        const value = customValueGetter ? customValueGetter(field.id) : formData.get(field.id);

        const onValueChange = (text: string) => {
            if (customValueChange) {
                customValueChange(field.id, text);
                return;
            }
            valueChanged(field.id, text);
        };

        const RenderComponent = FieldMapper[field.type];
        // component does exist
        if (!RenderComponent) {
            console.error(`${JSON.stringify(field)} settings error`);
        }

        return (
            <RenderComponent
                ref={ref}
                disabled={reportDisabled}
                field={field}
                value={value}
                onValueChange={onValueChange}
            />
        );
    },
);

export default observer(ReportDynamicField);
