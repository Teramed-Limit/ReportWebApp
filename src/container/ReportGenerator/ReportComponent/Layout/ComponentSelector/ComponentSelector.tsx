import React from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { AiOutlineMinus } from 'react-icons/ai';
import { BsCardImage } from 'react-icons/bs';
import { FaMousePointer } from 'react-icons/fa';
import { IoTextOutline } from 'react-icons/io5';
import { TbNumbers } from 'react-icons/tb';
import { useRecoilState } from 'recoil';

import { reportSelectedToolAtom } from '../../../../../atom/report-generator';
import StyledTreeItem from '../../../../../components/StyledTreeItem/StyledTreeItem';
import { ReportComponentType } from '../../../../../interface/report-generator/component/rep-component';

const ComponentSelector = () => {
    const [activeTool, setSelectedTool] = useRecoilState(reportSelectedToolAtom);

    const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
        if (!Object.values(ReportComponentType).includes(nodeId as ReportComponentType)) return;
        setSelectedTool(nodeId as ReportComponentType);
    };

    return (
        <TreeView
            sx={{ height: '100%', width: '200px', padding: '8px 8px 8px 0' }}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            selected={activeTool}
            expanded={['Categories']}
            onNodeSelect={handleSelect}
        >
            <StyledTreeItem
                nodeId={ReportComponentType.General}
                labelText="General"
                labelIcon={FaMousePointer}
            />
            <StyledTreeItem
                nodeId={ReportComponentType.Label}
                labelText="Label"
                labelIcon={IoTextOutline}
            />
            <StyledTreeItem
                nodeId={ReportComponentType.DynamicLabel}
                labelText="Dynamic Label"
                labelIcon={IoTextOutline}
            />
            <StyledTreeItem
                nodeId={ReportComponentType.Image}
                labelText="Image"
                labelIcon={BsCardImage}
            />
            <StyledTreeItem
                nodeId={ReportComponentType.Signature}
                labelText="Signature"
                labelIcon={BsCardImage}
            />
            <StyledTreeItem
                nodeId={ReportComponentType.Line}
                labelText="Line"
                labelIcon={AiOutlineMinus}
            />
            <StyledTreeItem
                nodeId={ReportComponentType.PageNumber}
                labelText="Page Number"
                labelIcon={TbNumbers}
            />
        </TreeView>
    );
};
export default ComponentSelector;
