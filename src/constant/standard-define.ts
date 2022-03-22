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
                            type: 'Selection',
                            optionSource: {
                                type: 'http',
                                source: 'ReportERSTypeList',
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
                            type: 'Selection',
                            optionSource: {
                                type: 'http',
                                source: 'ReportTemplateList',
                            },
                            filterCondition: {
                                filterById: 'ERSType',
                                filterOptionKey: 'ERSType',
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
            id: 'sectionProcedure',
            type: 'form',
            divider: true,
            ratio: ['50%', '50%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'ProcedureDate',
                            label: 'Procedure Date',
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
                            id: 'TimeStart',
                            label: 'Time Start',
                            type: 'Composite',
                            fields: [
                                {
                                    id: 'StartTimeHour',
                                    type: 'Selection',
                                    optionSource: {
                                        type: 'static',
                                        source: 'Hour',
                                    },
                                },
                                {
                                    id: 'StartTimeMin',
                                    type: 'Selection',
                                    optionSource: {
                                        type: 'static',
                                        source: 'Min',
                                    },
                                },
                            ],
                        },
                        {
                            id: 'TimeEnd',
                            label: 'Time End',
                            type: 'Composite',

                            fields: [
                                {
                                    id: 'EndTimeHour',
                                    type: 'Selection',
                                    optionSource: {
                                        type: 'static',
                                        source: 'Hour',
                                    },
                                },
                                {
                                    id: 'EndTimeMin',
                                    type: 'Selection',
                                    optionSource: {
                                        type: 'static',
                                        source: 'Min',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionGeneral',
            type: 'form',
            ratio: ['50%', '50%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'ReferringProvider',
                            label: 'Referring Provider',
                            type: 'Selection',
                            optionSource: {
                                type: 'http',
                                source: 'ReportReferringProviderList',
                            },
                        },
                        {
                            id: 'ChiefEndoscopist',
                            label: 'Chief Endoscopist',
                            type: 'Text',
                            readOnly: true,
                        },
                        {
                            id: 'Endoscopist',
                            label: 'Endoscopist',
                            type: 'Selection',
                            optionSource: {
                                type: 'http',
                                source: 'Endoscopist',
                            },
                        },
                    ],
                },
                {
                    id: 'subSection_2',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'Sedation',
                            label: 'Sedation',
                            type: 'Text',
                        },
                        {
                            id: 'Anesthesiologist',
                            label: 'Anesthesiologist',
                            type: 'Selection',
                            optionSource: {
                                type: 'http',
                                source: 'Anesthesiologist',
                            },
                        },
                        {
                            id: 'AssistingNurse',
                            label: 'Assisting Nurse',
                            type: 'Selection',
                            optionSource: {
                                type: 'http',
                                source: 'Nurse',
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionIndication',
            type: 'form',
            ratio: ['50%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['50%'],
                    fields: [
                        {
                            id: 'Indication',
                            label: 'Indication',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'http',
                                source: 'ReportIndicationList',
                            },
                            filterCondition: {
                                filterById: 'ERSType',
                                filterOptionKey: 'ERSType',
                            },
                            maxLength: 64,
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionInstrument',
            type: 'form',
            ratio: ['100%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'InstrumentDataset',
                            label: 'Instrument',
                            type: 'Selection',
                            isMulti: true,
                            orientation: 'vertical',
                            optionSource: {
                                type: 'http',
                                source: 'Instrument',
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionFindings',
            type: 'form',
            ratio: ['100%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'Findings',
                            label: 'Findings',
                            type: 'TextArea',
                            orientation: 'vertical',
                            buttonBar: [
                                {
                                    id: 'createTemplate',
                                    label: 'Create Template',
                                    action: 'createTemplate',
                                },
                                {
                                    id: 'retrieveTemplate',
                                    label: 'Retrieve Template',
                                    action: 'retrieveTemplate',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            label: 'Diagnosis',
            id: 'sectionDiagnosis',
            type: 'form',
            ratio: ['50%', '50%', '100%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'DiagnosisPrimary',
                            termId: 'DiagnosisPrimaryTermID',
                            label: 'Primary',
                            type: 'AsyncLexicon',
                            optionSource: {
                                params: 'Diagnosis',
                            },
                            validate: {
                                type: 'required',
                            },
                            maxLength: 256,
                        },
                    ],
                },
                {
                    id: 'subSection_2',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'DiagnosisSecondary',
                            termId: 'DiagnosisSecondaryTermID',
                            label: 'Secondary (Optional)',
                            type: 'AsyncLexicon',
                            optionSource: {
                                params: 'Diagnosis',
                            },
                            maxLength: 256,
                        },
                    ],
                },
                {
                    id: 'subSection_3',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'DiagnosisExtra',
                            label: 'Optional',
                            type: 'TextArea',
                            orientation: 'vertical',
                            maxLength: 1024,
                        },
                    ],
                },
            ],
        },
        {
            label: 'Procedures',
            id: 'sectionProcedures',
            type: 'form',
            ratio: ['50%', '50%', '100%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'ProcedurePrimary',
                            termId: 'ProcedurePrimaryTermID',
                            label: 'Primary',
                            type: 'AsyncLexicon',
                            optionSource: {
                                params: 'Procedure',
                            },
                            validate: {
                                type: 'required',
                            },
                            maxLength: 256,
                        },
                    ],
                },
                {
                    id: 'subSection_2',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'ProcedureSecondary',
                            termId: 'ProcedureSecondaryTermID',
                            label: 'Secondary (Optional)',
                            type: 'AsyncLexicon',
                            optionSource: {
                                params: 'Procedure',
                            },
                            maxLength: 256,
                        },
                    ],
                },
                {
                    id: 'subSection_3',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'ProcedureExtra',
                            label: 'Optional',
                            type: 'TextArea',
                            orientation: 'vertical',
                            maxLength: 1024,
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionManagementPlan',
            type: 'form',
            ratio: ['100%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'ManagementPlan',
                            label: 'Management Plan',
                            type: 'TextArea',
                            orientation: 'vertical',
                            maxLength: 1024,
                        },
                    ],
                },
            ],
        },
    ],
};
