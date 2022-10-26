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
                            type: 'CodeListSelection',
                            optionSource: {
                                type: 'http',
                                source: 'ERSType',
                            },
                            validate: {
                                type: 'required',
                            },
                            labelStyle: { color: '#339966' },
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
                            labelStyle: { color: '#339966' },
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionPatientInfo',
            type: 'form',
            divider: true,
            ratio: ['50%', '12%', '10%', '28%'],
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
                            labelStyle: { color: '#339966' },
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
                            labelStyle: { color: '#339966' },
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
                            labelStyle: { color: '#339966' },
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
                            labelStyle: { color: '#339966' },
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
                            id: 'AccessionNumber',
                            label: 'Accession No',
                            type: 'Text',
                            readOnly: true,
                            labelStyle: { color: '#339966' },
                        },
                        {
                            id: 'Sedation',
                            label: 'Sedation',
                            type: 'Composite',
                            labelStyle: { color: '#339966' },
                            fields: [
                                {
                                    id: 'SedationDrug',
                                    type: 'CodeListSelection',
                                    optionSource: {
                                        type: 'http',
                                        source: 'Sedation',
                                    },
                                },
                                {
                                    id: 'SedationDosage',
                                    type: 'Text',
                                    suffix: 'mg',
                                },
                            ],
                        },
                        {
                            id: 'ProceduresComposite',
                            label: 'Procedure',
                            type: 'Composite',
                            compositeOrientation: 'vertical',
                            labelStyle: { alignSelf: 'flex-start', color: '#339966' },
                            fields: [
                                {
                                    id: 'ProceduresDataset',
                                    label: 'Procedure',
                                    type: 'CodeListSelection',
                                    isMulti: true,
                                    optionSource: {
                                        type: 'http',
                                        source: 'Procedure',
                                    },
                                    filterCondition: {
                                        filterById: 'ERSType',
                                    },
                                },
                                {
                                    id: 'ProcedureExtra',
                                    label: 'Other Procedure',
                                    type: 'TextArea',
                                    rows: 2,
                                    placeholder: 'Other Procedure',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'subSection_2',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'DateOfProcedure',
                            label: 'Date of Procedure',
                            type: 'DatePicker',
                            validate: {
                                type: 'required',
                            },
                            labelStyle: { color: '#339966' },
                        },
                        {
                            id: 'ChiefEndoscopist',
                            label: 'Doctor in Charge',
                            type: 'CodeListSelection',
                            optionSource: {
                                type: 'http',
                                source: 'Doctor',
                            },
                            labelStyle: { color: '#339966' },
                        },
                        {
                            id: 'Endoscopist',
                            label: 'Endoscopist',
                            type: 'CodeListSelection',
                            optionSource: {
                                type: 'http',
                                source: 'Doctor',
                            },
                            labelStyle: { color: '#339966' },
                        },
                        {
                            id: 'Anesthesiologist',
                            label: 'Anaesthetist',
                            type: 'CodeListSelection',
                            optionSource: {
                                type: 'http',
                                source: 'Anaesthetist',
                            },
                            labelStyle: { color: '#339966' },
                        },
                        {
                            id: 'EndoscopeUsed',
                            label: 'Endoscope used',
                            type: 'CodeListSelection',
                            optionSource: {
                                type: 'http',
                                source: 'Instrument',
                            },
                            labelStyle: { color: '#339966' },
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionIndication',
            type: 'form',
            ratio: ['50%', '50%'],
            subSections: [
                {
                    id: 'subSection_1',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'IndicationComposite',
                            label: 'Indication',
                            type: 'Composite',
                            compositeOrientation: 'vertical',
                            labelStyle: { alignSelf: 'flex-start', color: '#0000FF', fontSize: 16 },
                            fields: [
                                {
                                    id: 'Indication',
                                    label: 'Indication',
                                    type: 'CodeListLexiconInput',
                                    optionSource: {
                                        type: 'http',
                                        source: 'Indication',
                                    },
                                    filterCondition: {
                                        filterById: 'ERSType',
                                    },
                                },
                                {
                                    id: 'IndicationOptional',
                                    label: 'Other Indication',
                                    type: 'TextArea',
                                    rows: 2,
                                    placeholder: 'Other Indication',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'subSection_2',
                    ratio: ['100%'],
                    fields: [],
                },
            ],
        },
        {
            id: 'sectionFindings',
            type: 'form',
            maxWidth: '70%',
            ratio: ['100%', '50%', '50%', '100%'],
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
                            labelStyle: { color: '#0000FF', fontSize: 16 },
                            buttonBar: [
                                {
                                    id: 'fillInDetails',
                                    label: 'Fill in details',
                                    action: 'openModal',
                                    actionParams: { modalName: 'fillInDetails' },
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'subSection_2',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'Diagnosis',
                            label: 'Diagnosis',
                            type: 'Composite',
                            orientation: 'vertical',
                            compositeOrientation: 'vertical',
                            labelStyle: { color: '#0000FF', alignSelf: 'flex-start', fontSize: 16 },
                            fields: [
                                {
                                    id: 'DiagnosisDataset',
                                    type: 'CodeListSelection',
                                    isMulti: true,
                                    optionSource: {
                                        type: 'http',
                                        source: 'Diagnosis',
                                    },
                                    filterCondition: {
                                        filterById: 'ERSType',
                                    },
                                },
                                {
                                    id: 'DiagnosisExtra',
                                    type: 'TextArea',
                                    rows: 2,
                                    placeholder: 'Other Diagnosis',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'subSection_3',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'OtherDescription',
                            label: 'Bowel Prep.',
                            type: 'TextArea',
                            orientation: 'vertical',
                            maxLength: 1024,
                            labelStyle: { color: '#0000FF', fontSize: 16 },
                            buttonBar: [
                                {
                                    id: 'quantityIndicatorAction',
                                    label: 'Quality Indicator',
                                    action: 'openModal',
                                    actionParams: { modalName: 'colonoscopyQualityIndicators' },
                                    disable: 'never',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'subSection_4',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'SpecimenDescription',
                            label: 'Specimen Description',
                            type: 'TextArea',
                            orientation: 'vertical',
                            labelStyle: { color: '#0000FF', fontSize: 16 },
                            maxLength: 1024,
                        },
                    ],
                },
            ],
        },
        {
            id: 'sectionDiagrams',
            type: 'form',
            maxWidth: '30%',
            ratio: ['100%'],
            subSections: [
                {
                    id: 'subSection_4',
                    ratio: ['100%'],
                    fields: [
                        {
                            id: 'DiagramData',
                            type: 'ReportDiagram',
                            hideLabel: true,
                            imageSource: {
                                type: 'base64',
                            },
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
                                    type: 'http',
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
                            },
                            {
                                id: 'IsCaecumReached',
                                label: 'Is Caecum Reached',
                                type: 'Radio',
                                optionSource: {
                                    type: 'http',
                                    source: 'YesNo',
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
                        ],
                    },
                ],
            },
        ],
    },
};
