export const pdfStandardDefine = {
    sections: [
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
                                    id: 'fillInDetails',
                                    label: 'Fill in details',
                                    action: 'openModal',
                                    actionParams: { modalName: 'fillInDetails' },
                                },
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
            ratio: ['100%', '100%', '100%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'DiagnosisPrimary',
                            termId: 'DiagnosisPrimaryTermID',
                            label: 'Diagnosis (Primary)',
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
                            label: 'Diagnosis (Secondary)',
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
                            hideLabel: true,
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
            ratio: ['100%', '100%', '100%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'ProcedurePrimary',
                            termId: 'ProcedurePrimaryTermID',
                            label: 'Procedure (Primary)',
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
                            label: 'Procedure (Secondary)',
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
                            hideLabel: true,
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
