import React from 'react';

import { FieldFilterTreeNode } from '../../interface/field-filter-tree-node';

interface Props {
    treeNode: FieldFilterTreeNode;
}

const FilterRuleVisualizationChart = ({ treeNode }: Props) => {
    return <TreeNodeComponent node={treeNode} />;
};

const TreeNodeComponent = ({ node }: { node: FieldFilterTreeNode }) => {
    // 根據節點類型來設定背景顏色
    let bgColor = '';
    let borderColor = 'transparent';
    let borderLeft = `6px solid`;
    const margin = '10px';
    switch (node.Type) {
        case 'Root':
            bgColor = '#E7E9EA';
            borderColor = '#26292b';
            borderLeft = '1px solid';
            break;
        case 'Rule':
            bgColor = '#ddf1df';
            borderColor = 'rgb(0 170 0 / 86%)';
            break;
        case 'Conjunction':
            bgColor = '#edd2d3';
            borderColor = '#d22';
            break;
        case 'Grouping':
            bgColor = '#F4F0B6';
            borderColor = 'rgb(221 119 0 / 68%)';

            break;
        default:
            bgColor = 'white';
            break;
    }

    return (
        <div
            style={{
                backgroundColor: bgColor,
                border: '1px solid',
                borderLeft,
                borderLeftColor: borderColor,
                borderColor,
                margin,
                padding: '10px',
                borderRadius: '6px',
                fontWeight: '700',
                color: '#585e63',
            }}
        >
            {/* 顯示節點的值 */}
            {node.Value}
            {/* 若此節點有子節點，則遞迴呼叫 TreeNodeComponent 來渲染每一個子節點 */}
            {node.Children &&
                node.Children.map((childNode) => (
                    <TreeNodeComponent key={childNode.ID} node={childNode} />
                ))}
        </div>
    );
};

export default FilterRuleVisualizationChart;
