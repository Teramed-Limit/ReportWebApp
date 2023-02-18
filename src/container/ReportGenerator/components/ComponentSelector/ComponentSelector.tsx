import React from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import TreeView from '@mui/lab/TreeView';
import { BsCardImage } from 'react-icons/bs';
import { FaMousePointer } from 'react-icons/fa';
import { IoMdText } from 'react-icons/io';
import { useRecoilState } from 'recoil';

import { reportSelectedTool } from '../../../../atom/report-generator';
import StyledTreeItem from '../../../../components/StyledTreeItem/StyledTreeItem';
import { ReportComponentType } from '../../ReportComponent/report-component-mapper';

const ComponentSelector = ({}) => {
    const [activeTool, setSelectedTool] = useRecoilState(reportSelectedTool);

    const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
        setSelectedTool(nodeId as ReportComponentType);
    };

    return (
        <TreeView
            sx={{ height: '100%', width: '200px', padding: '8px 8px 8px 0' }}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 24 }} />}
            selected={activeTool}
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
                labelIcon={IoMdText}
            />
            <StyledTreeItem
                nodeId={ReportComponentType.Image}
                labelText="Image"
                labelIcon={BsCardImage}
            />
            <StyledTreeItem
                nodeId={ReportComponentType.DynamicLabel}
                labelText="Dynamic Label"
                labelIcon={IoMdText}
            />
        </TreeView>
    );
};

export default ComponentSelector;
