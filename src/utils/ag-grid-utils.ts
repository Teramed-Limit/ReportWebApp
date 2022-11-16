import { parse } from 'date-fns';

export const dateFilterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
        if (cellValue == null) return -1;
        const cellDate = parse(cellValue, 'yyyyMMdd', new Date());

        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
        }
        if (cellDate < filterLocalDateAtMidnight) {
            return -1;
        }
        if (cellDate > filterLocalDateAtMidnight) {
            return 1;
        }
    },
    browserDatePicker: true,
    inRangeInclusive: true,
    minValidYear: 2000,
    filterOptions: ['inRange', 'empty'],
    defaultOption: 'inRange',
};
