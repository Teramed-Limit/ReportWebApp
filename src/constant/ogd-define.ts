export const ogdDefine = {
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
                            type: 'Array',
                            templateField: {
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
                            labelStyle: { color: '#339966' },
                            validate: {
                                type: 'required',
                            },
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
            ratio: ['100%', '100%', '100%'],
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
                                    orientation: 'vertical',
                                    rows: 2,
                                    placeholder: 'Other Diagnosis',
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
};
