// 建立 TreeNodeInterface 來描述我們的樹狀節點結構
export interface FieldFilterTreeNode {
    // 節點的唯一識別符號
    ID: string;
    // 節點的值
    Value: string;
    // 節點的類型
    Type: 'Root' | 'Rule' | 'Conjunction' | 'Grouping';
    // 子節點列表，每一個子節點都是一個 TreeNodeInterface
    Children: FieldFilterTreeNode[];
}
