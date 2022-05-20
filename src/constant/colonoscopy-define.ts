export const colonoscopyDefine = {
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
                                    id: 'quantityIndicatorAction',
                                    label: 'Quality Indicator',
                                    action: 'openModal',
                                    actionParams: { modalName: 'colonoscopyQualityIndicators' },
                                    disable: 'never',
                                },
                                {
                                    id: 'createTemplate',
                                    label: 'Create Template',
                                    action: 'createTemplate',
                                },
                                {
                                    id: 'retrieveTemplate',
                                    label: 'Retrieve Template',
                                    action: 'openModal',
                                    actionParams: { modalName: 'retrieveTemplate' },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionColonFindings',
            type: 'form',
            ratio: ['50%', '50%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'Terminallleum',
                            label: 'Terminal lleum',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'static',
                                source: 'ColonDetail',
                            },
                        },
                        {
                            id: 'Caecum',
                            label: 'Caecum',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'static',
                                source: 'ColonDetail',
                            },
                        },
                        {
                            id: 'AscendingColon',
                            label: 'Ascending Colon',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'static',
                                source: 'ColonDetail',
                            },
                        },
                        {
                            id: 'HepaticFlexure',
                            label: 'Hepatic Flexure',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'static',
                                source: 'ColonDetail',
                            },
                        },
                        {
                            id: 'Transverse',
                            label: 'Transverse',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'static',
                                source: 'ColonDetail',
                            },
                        },
                    ],
                },
                {
                    id: 'subSection_2',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'SplenicFlexure',
                            label: 'Splenic Flexure',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'static',
                                source: 'ColonDetail',
                            },
                        },
                        {
                            id: 'Descending',
                            label: 'Descending',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'static',
                                source: 'ColonDetail',
                            },
                        },
                        {
                            id: 'Sigmoid',
                            label: 'Sigmoid',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'static',
                                source: 'ColonDetail',
                            },
                        },
                        {
                            id: 'Rectum',
                            label: 'Rectum',
                            type: 'Lexicon',
                            optionSource: {
                                type: 'static',
                                source: 'ColonDetail',
                            },
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
    modal: {
        modalName: 'colonoscopyQualityIndicators',
        sections: [
            {
                id: 'sectionDialog',
                type: 'form',
                ratio: ['100%'],
                subSections: [
                    {
                        id: 'subSection_1',
                        ratio: ['100%'],
                        fields: [
                            {
                                id: 'QualityOfBowelPreparation',
                                label: 'Quality of Bowel Preparation',
                                type: 'Radio',
                                optionSource: {
                                    type: 'static',
                                    source: 'AdequateInadequate',
                                },
                                validate: {
                                    type: 'qualityBowelRequired',
                                },
                            },
                            {
                                id: 'QualityBowelScore',
                                type: 'QualityBowelScore',
                                validate: {
                                    type: 'qualityBowelScore',
                                },
                            },
                            {
                                id: 'WithdrawalTime',
                                label: 'Colonoscopy Withdrawal Time',
                                type: 'Number',
                                suffix: 'Minutes',
                                validate: {
                                    type: 'qualityBowelMin',
                                    params: { min: 0 },
                                },
                            },
                            {
                                id: 'IsCaecumReached',
                                label: 'Is Caecum Reached',
                                type: 'Radio',
                                optionSource: {
                                    type: 'static',
                                    source: 'YesNo',
                                },
                                validate: {
                                    type: 'qualityBowelRequired',
                                },
                            },
                            {
                                id: 'MechanicalObstruction',
                                label: 'Mechanical Obstruction',
                                type: 'Checkbox',
                                checkboxLabel:
                                    'Mechanical Obstruction (e.g. obstructing lesion / tumor, previous known stricture)',
                            },
                            {
                                id: 'TechnicalDifficulties',
                                type: 'Checkbox',
                                checkboxLabel:
                                    'Technical Difficulties (e.g. acute bending / kinking, patient intolerance)',
                            },
                            {
                                id: 'PostRighthemicolectomy',
                                type: 'Checkbox',
                                checkboxLabel: 'Post Right hemicolectomy',
                            },
                            {
                                id: 'BowelPreparation',
                                type: 'Checkbox',
                                checkboxLabel: 'Bowel Preparation',
                            },
                            {
                                id: 'PlannedforPartialColonoscopy',
                                type: 'Checkbox',
                                checkboxLabel: 'Planned for Partial Colonoscopy',
                            },
                            {
                                id: 'OccurrenceofComplication',
                                type: 'Checkbox',
                                checkboxLabel: 'Occurrence of Complication',
                            },
                            {
                                id: 'OtherDescription',
                                label: 'Other',
                                type: 'Text',
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
