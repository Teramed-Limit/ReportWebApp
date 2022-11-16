export interface CodeListMap {
    [props: string]: CodeList[];
}

export interface CodeList {
    Id: number;
    Label: string;
    Value: string;
    CodeName: string;
    ParentCodeValue: string;
    OrderingIndex: number;
}
