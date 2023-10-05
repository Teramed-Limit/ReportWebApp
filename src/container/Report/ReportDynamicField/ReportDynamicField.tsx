import React from 'react';

import { observer } from 'mobx-react';

import { Field } from '../../../interface/report-field/field';
import { FieldMapper } from '../FieldComponent/field-mapper';

interface DynamicFieldProps {
    field: Field;
    value: any;
    modifiable: boolean;
    onValueChange?: (value: any) => void;
}

const ReportDynamicField = React.forwardRef(
    ({ field, value, modifiable, onValueChange }: DynamicFieldProps, ref) => {
        // const store = useReportDataStore();
        // const { formData, valueChanged, modifiable } = store;
        //
        // const value = customValueGetter ? customValueGetter(field.id) : formData.get(field.id);
        //
        // console.log('ReportDynamicField', field.id, value);
        //
        // const onValueChange = (text: string) => {
        //     if (customValueChange) {
        //         customValueChange(field.id, text);
        //         return;
        //     }
        //     valueChanged(field.id, text);
        // };

        const RenderComponent = FieldMapper[field.type];
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
