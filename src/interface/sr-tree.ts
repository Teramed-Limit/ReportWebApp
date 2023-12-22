export interface SRTreeValue {
    Code: string;
    Value: string | null;
    ValueWithUnit: string | null;
    ValueType: string | null;
    Unit: string | null;
    UnitMeaning: string | null;
}

export interface SRTreeNode {
    NodeId: string;
    Value: SRTreeValue;
    Children: SRTreeNode[];
    Parent: SRTreeNodeRef;
}

export interface SRTreeNodeRef {
    NodeId: string;
    Parent: SRTreeNodeRef;
    Value: SRTreeValue;
}
