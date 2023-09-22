export interface RepComponent {
    uuid: string;
    x: number;
    y: number;
    componentType: ReportComponentType;
}

export enum ReportComponentType {
    General = 'General',
    Label = 'Label',
    DynamicLabel = 'DynamicLabel',
    Image = 'Image',
    Signature = 'Signature',
    Line = 'Line',
    PageNumber = 'PageNumber',
}
