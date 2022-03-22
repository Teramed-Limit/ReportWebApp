import React from 'react';

import { observer } from 'mobx-react';

import { Field } from '../../../interface/field';
import { useReportDataStore } from '../../../models/useStore';
import { FieldMapper } from '../field/field-mapper';

interface DynamicFieldProps {
    field: Field;
}

const ReportDynamicField = React.forwardRef(({ field }: DynamicFieldProps, ref) => {
    const store = useReportDataStore();
    const { formData, valueChanged, reportDisabled } = store;

    const value = formData.get(field.id);

    const onValueChange = (text: string) => {
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
});

export default observer(ReportDynamicField);
