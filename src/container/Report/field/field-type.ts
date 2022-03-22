export enum FormFieldType {
    Text = 'Text',
    TextArea = 'TextArea',
    Dropdown = 'Dropdown',
    Selection = 'Selection',
    Lexicon = 'Lexicon',
    AsyncLexicon = 'AsyncLexicon',
    Composite = 'Composite',
    Checkbox = 'Checkbox',
    Radio = 'Radio',
    Number = 'Number',
    QualityBowelScore = 'QualityBowelScore',
}

export const noBorderField = {
    [FormFieldType.Radio]: true,
    [FormFieldType.Checkbox]: true,
    [FormFieldType.QualityBowelScore]: true,
};
