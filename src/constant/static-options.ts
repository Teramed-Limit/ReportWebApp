const generateTimeOptions = (length: number): any[] => {
    const options = [] as { Name: string; Code: string }[];
    for (let i = 0; i < length; i++) {
        let value = i.toString();
        while (value.length < 2) {
            value = `0${value}`;
        }
        options.push({ Name: value, Code: i.toString() });
    }
    return options;
};

const minOptions = generateTimeOptions(60);
const hourOptions = generateTimeOptions(24);
const colonDetail = [
    { Name: 'N/A', Code: '1' },
    { Name: 'Normal', Code: '2' },
];
const yesNo = [
    { Name: '1', Code: 'Yes' },
    { Name: '0', Code: 'No' },
];
const adequateInadequate = [
    { Name: '1', Code: 'Adequate' },
    { Name: '0', Code: 'Inadequate' },
];

const modalityOptions = [
    'AR',
    'BI',
    'BMD',
    'EPS',
    'CR',
    'CT',
    'DMS',
    'DG',
    'DX',
    'ECG',
    'EEG',
    'EMG',
    'EOG',
    'ES',
    'XC',
    'GM',
    'HD',
    'IO',
    'IVOCT',
    'IVUS',
    'KER',
    'LS',
    'LEN',
    'MR',
    'MG',
    'NM',
    'OAM',
    'OPM',
    'OP',
    'OPT',
    'OPTBSV',
    'OPTENF',
    'OPV',
    'OCT',
    'OSS',
    'PX',
    'POS',
    'PT',
    'RF',
    'RG',
    'RESP',
    'RTIMAGE',
    'SC',
    'SM',
    'SRF',
    'TG',
    'US',
    'BDUS',
    'VA',
    'XA',
];

export const staticOptionType = {
    Modality: modalityOptions,
    Min: minOptions,
    Hour: hourOptions,
    ColonDetail: colonDetail,
    AdequateInadequate: adequateInadequate,
    YesNo: yesNo,
};
