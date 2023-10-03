import React, { ForwardedRef, useEffect } from 'react';

import dayjs from 'dayjs';

import BaseTimePicker from '../../../../components/UI/BaseTimePicker/BaseTimePicker';
import { TimeField } from '../../../../interface/report-field/time-field';
import { isEmptyOrNil } from '../../../../utils/general';

interface Props {
    field: TimeField;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

const TimePicker = React.forwardRef(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ field, value, onValueChange, disabled }: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
        // Set default value
        useEffect(() => {
            if (field?.defaultNow && isEmptyOrNil(value)) {
                // 使用 format 函數將日期時間格式化成 "HH:mm:ss A" 格式的字串
                const currentTime = dayjs();
                const formattedTime = currentTime.format('HH:mm:ss A');
                onValueChange(formattedTime);
            }
        }, [field.defaultNow, onValueChange, value]);

        return (
            <BaseTimePicker
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

export default TimePicker;
