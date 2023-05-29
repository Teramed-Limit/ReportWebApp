let dateFormat = 'yyyy/MM/dd';
let dateTimeFormat = 'yyyy/MM/dd HH:mm';
let signatureCorrespondingField = '';
let enableDeleteProtection = false;
let ipAddress = '127.0.0.1';

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

const getIpAddress = () => {
    return ipAddress;
};

const setIpAddress = (value: string) => {
    ipAddress = value;
};

const ConfigService = {
    getIpAddress,
    setIpAddress,
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
