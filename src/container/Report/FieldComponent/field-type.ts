export enum FormFieldType {
    Text = 'Text',
    TextArea = 'TextArea',
    CodeListSelection = 'CodeListSelection',
    CodeListLexicon = 'CodeListLexiconInput',
    AsyncLexicon = 'AsyncLexicon',
    Composite = 'Composite',
    Checkbox = 'Checkbox',
    Radio = 'Radio',
    Number = 'Number',
    QualityBowelScore = 'QualityBowelScore',
    ReportDiagram = 'ReportDiagram',
    DatePicker = 'DatePicker',
    TimePicker = 'TimePicker',
    Array = 'Array',
    SRText = 'SRText',
    OBGYNChart = 'OBGYNChart',
}

export enum LayoutType {
    Page = 'Page',
    Section = 'Section',
    SubSection = 'SubSection',
}

export const noBorderField = {
    [FormFieldType.Radio]: true,
    [FormFieldType.Checkbox]: true,
    [FormFieldType.QualityBowelScore]: true,
    [FormFieldType.OBGYNChart]: true,
};

export const noLabelField = {
    [FormFieldType.ReportDiagram]: true,
};
