let dateFormat = 'yyyy/MM/dd';
let dateTimeFormat = 'yyyy/MM/dd HH:mm';
let signatureCorrespondingField = '';

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

const getSignatureCorrespondingField = () => {
    return signatureCorrespondingField;
};

const setSignatureCorrespondingField = (value: string) => {
    signatureCorrespondingField = value;
};

const ConfigService = {
    getDateFormat,
    setDateFormat,
    getDateTimeFormat,
    setDateTimeFormat,
    getSignatureCorrespondingField,
    setSignatureCorrespondingField,
};

export default ConfigService;
