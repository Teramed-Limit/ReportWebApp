import React, { ForwardedRef, useEffect } from 'react';

import BaseDatePicker from '../../../../components/UI/BaseDatePicker/BaseDatePicker';
import { DateField } from '../../../../interface/report-field/date-field';
import { convertToDate, isEmptyOrNil } from '../../../../utils/general';

interface Props {
    field: DateField;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

const DatePicker = React.forwardRef(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ field, value, onValueChange, disabled }: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
        // Set default value
        useEffect(() => {
            if (field?.defaultToday && isEmptyOrNil(value))
                onValueChange(convertToDate(new Date(), field.toFormat || 'yyyy-MM-dd'));
        }, [field.defaultToday, field.fromFormat, field.toFormat, onValueChange, value]);

        return (
            <BaseDatePicker
                id={field.id}
                disabled={disabled || field.readOnly}
                value={value}
                onValueChange={onValueChange}
                prefix={field.prefix}
                suffix={field.suffix}
            />
        );
    },
);

export default DatePicker;
