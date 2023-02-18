// Fill in details
export interface CategoryContents {
    ContentId: string;
    Content: string;
    IsDefault: boolean;
    DisplayIndex: number;
    ItemId: string;
}

// Fill in details
export interface FormFieldLexiconCategory {
    Id: string;
    ReportTemplate: string;
    FieldId: string;
    ItemName: string;
    DisplayIndex: number;
    AutoFillDefaultWhenEmpty: boolean;
    CategoryContents: CategoryContents[];
    Text: string;
}

// Fill in details
export interface ReorderFormFieldLexiconCategoryBody {
    Id: string;
    DisplayIndex: number;
}

export interface FormFieldLexicon {
    Number: number;
    ReportTemplate: string;
    FieldId: string;
    Content: string;
}
