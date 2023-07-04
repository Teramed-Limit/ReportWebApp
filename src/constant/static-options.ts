const FilterRuleOperator = [
    { Value: 'foEqual', Label: 'Equal' },
    { Value: 'foNotEqual', Label: 'Not Equal' },
    { Value: 'foLessThan', Label: 'Less Than' },
    { Value: 'foLessThanOrEqual', Label: 'Less Than or Equal' },
    { Value: 'foGreaterThan', Label: 'Greater Than' },
    { Value: 'foGreaterThanOrEqual', Label: 'Greater Than or Equal' },
    { Value: 'foContains', Label: 'Contains' },
    { Value: 'foNotContains', Label: 'Not Contains' },
    { Value: 'foStartsWith', Label: 'Starts With' },
    { Value: 'fonNotStartsWith', Label: 'Not Starts With' },
    { Value: 'foEndsWith', Label: 'Ends With' },
    { Value: 'fonNotEndsWith', Label: 'Not Ends With' },
    { Value: 'foIsNull', Label: 'Is Null' },
    { Value: 'foIsNotNull', Label: 'Is Not Null' },
    { Value: 'foIsEmpty', Label: 'Is Empty' },
];

const FilterRuleAndOr = [
    { Value: 'coAnd', Label: 'And' },
    { Value: 'coOr', Label: 'Or' },
];

const FilterField = [
    { Value: 'PatientId', Label: 'Patient Id' },
    { Value: 'PatientsName', Label: 'Patients Name' },
    { Value: 'PatientsAge', Label: 'Patients Age' },
    { Value: 'AccessionNumber', Label: 'Accession Number' },
    { Value: 'StudyDescription', Label: 'Study Description' },
    { Value: 'Modality', Label: 'Modality' },
    { Value: 'ReferringPhysiciansName', Label: 'Referring Physicians Name' },
    { Value: 'NameofPhysiciansReading', Label: 'Name of Physicians Reading' },
    { Value: 'PerformingPhysiciansName', Label: 'Performing Physicians Name' },
    { Value: 'Author', Label: 'Author' },
    { Value: 'ReportTemplate', Label: 'Report Template' },
    { Value: 'ReportStatus', Label: 'Report Status' },
];

export const staticOptionType = {
    FilterRuleOperator,
    FilterRuleAndOr,
    FilterField,
};
