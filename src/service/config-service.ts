let dateFormat = 'yyyy/MM/dd';
let dateTimeFormat = 'yyyy/MM/dd HH:mm';
let signatureCorrespondingField = '';
let enableDeleteProtection = false;

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

const getEnableDeleteProtection = () => {
    return enableDeleteProtection;
};

const setEnableDeleteProtection = (value: boolean) => {
    enableDeleteProtection = value;
};

const ConfigService = {
    getDateFormat,
    setDateFormat,
    getDateTimeFormat,
    setDateTimeFormat,
    getSignatureCorrespondingField,
    setSignatureCorrespondingField,
    getEnableDeleteProtection,
    setEnableDeleteProtection,
};

export default ConfigService;
