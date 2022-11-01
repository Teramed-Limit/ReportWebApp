export enum FormFieldType {
    Text = 'Text',
    TextArea = 'TextArea',
    Dropdown = 'Dropdown',
    Selection = 'Selection',
    CodeListSelection = 'CodeListSelection',
    Lexicon = 'Lexicon',
    CodeListLexicon = 'CodeListLexiconInput',
    AsyncLexicon = 'AsyncLexicon',
    Composite = 'Composite',
    Checkbox = 'Checkbox',
    Radio = 'Radio',
    Number = 'Number',
    QualityBowelScore = 'QualityBowelScore',
    ReportDiagram = 'ReportDiagram',
    DatePicker = 'DatePicker',
    Array = 'Array',
}

export const noBorderField = {
    [FormFieldType.Radio]: true,
    [FormFieldType.Checkbox]: true,
    [FormFieldType.QualityBowelScore]: true,
};
