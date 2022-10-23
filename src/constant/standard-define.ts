export const standardDefine = {
    sections: [
        {
            id: 'sectionReportType',
            type: 'form',
            divider: true,
            ratio: ['50%', '50%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'ERSType',
                            label: 'ERS Type',
                            type: 'CodeListSelection',
                            optionSource: {
                                type: 'http',
                                source: 'ERSType',
                            },
                            validate: {
                                type: 'required',
                            },
                        },
                    ],
                },
                {
                    id: 'subSection_2',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'ReportTemplate',
                            label: 'Report Template',
                            type: 'CodeListSelection',
                            optionSource: {
                                type: 'http',
                                source: 'ReportTemplate',
                            },
                            filterCondition: {
                                filterById: 'ERSType',
                            },
                            validate: {
                                type: 'required',
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionPatientInfo',
            type: 'form',
            divider: true,
            ratio: ['50%', '15%', '13%', '22%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'PatientsName',
                            label: 'Patient Name',
                            type: 'Text',
                            readOnly: true,
                        },
                    ],
                },
                {
                    id: 'subSection_2',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'PatientsSex',
                            label: 'Sex',
                            type: 'Text',
                            readOnly: true,
                        },
                    ],
                },
                {
                    id: 'subSection_3',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'PatientsAge',
                            label: 'Age',
                            type: 'Text',
                            readOnly: true,
                        },
                    ],
                },
                {
                    id: 'subSection_4',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'PatientId',
                            label: 'ID',
                            type: 'Text',
                            readOnly: true,
                        },
                    ],
                },
            ],
        },
    ],
};
