export const checkCondition = (type: string, value: string, targetValue: string) => {
    switch (type) {
        case 'equal':
            return value === targetValue;
        case 'contains':
            return value.includes(targetValue);
        case 'beginWith':
            return value.indexOf(targetValue) === 0;
        case 'endWith':
            return value.indexOf(targetValue) === value.length - targetValue.length;
        case 'greater':
            if (+value > +targetValue) {
                return true;
            }
            break;
        case 'lesser':
            if (+value < +targetValue) {
                return true;
            }
            break;
        default:
            return false;
    }
};
