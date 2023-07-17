export interface RepComponent {
    uuid: string;
    x: number;
    y: number;
    componentType: ReportComponentType;
    valueType: string;
    value: string;
}

export enum ReportComponentType {
    General = 'General',
    Label = 'Label',
    DynamicLabel = 'DynamicLabel',
    Image = 'Image',
    Signature = 'Signature',
}
