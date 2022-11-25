let dateFormat = 'yyyy/MM/dd';
let dateTimeFormat = 'yyyy/MM/dd HH:mm';

const getDateFormat = () => {
    return dateFormat;
};

const setDateFormat = (value: string) => {
    dateFormat = value;
};

const getDateTimeFormat = () => {
    return dateTimeFormat;
};

const setDateTimeFormat = (value: string) => {
    dateTimeFormat = value;
};

const ConfigService = {
    getDateFormat,
    setDateFormat,
    getDateTimeFormat,
    setDateTimeFormat,
};

export default ConfigService;
