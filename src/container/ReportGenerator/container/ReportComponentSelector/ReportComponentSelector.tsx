import React, { useRef, useState } from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import TreeView from '@mui/lab/TreeView';
import { Stack } from '@mui/material';
import { BsCardImage } from 'react-icons/bs';
import { FaMousePointer } from 'react-icons/fa';
import { IoMdText } from 'react-icons/io';
import { useRecoilState } from 'recoil';

import { reportSelectedTool } from '../../../../atom/report-generator';
import AttributeList from '../../../../components/AttributeList/AttributeList';
import ColorPickerButton from '../../../../components/ColorPickerButton/ColorPickerButton';
import StyledTreeItem from '../../../../components/StyledTreeItem/StyledTreeItem';
import BaseNativeSelection from '../../../../components/UI/BaseNativeSelection/BaseNativeSelection';
import { RepComponent } from '../../../../interface/rep-report';
import { ReportComponentType } from '../../ReportComponent/report-component-mapper';
import classes from '../ReportDefineAttributeEditor/ReportDefineAttributeEditor.module.scss';

interface Props {
    attribute?: RepComponent;
    onSetAttribute: (
        uuid: string,
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => void;
}

const ReportComponentSelector = ({ attribute = undefined, onSetAttribute }: Props) => {
    const [activeTool, setSelectedTool] = useRecoilState(reportSelectedTool);
    const [modalPosition, setModalPosition] = useState({
        left: 675,
        top: 25,
    });
    const canMoveRef = useRef(false);

    const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
        setSelectedTool(nodeId as ReportComponentType);
    };

    return (
        <Stack
            direction="column"
            style={{ transform: `translate(${modalPosition.top}px,${modalPosition.left}px)` }}
            className={classes.container}
        >
            <div
                className={classes.moveable}
                onMouseDown={() => (canMoveRef.current = true)}
                onMouseUp={() => (canMoveRef.current = false)}
                onMouseLeave={() => (canMoveRef.current = false)}
                onMouseMove={(e) => {
                    if (!canMoveRef.current) return;
                    setModalPosition((prev) => ({
                        left: prev.left + e.movementY,
                        top: prev.top + e.movementX,
                    }));
                }}
            />
            <Stack className={classes.title}>
                <div>Component</div>
            </Stack>
            <TreeView
                sx={{ height: '100%', width: '200px', padding: '8px 8px 8px 0' }}
                // defaultExpanded={['Categories']}
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
            <AttributeList
                attribute={attribute || {}}
                setAttribute={(attrName: (string | number)[], attrValue: any) => {
                    if (!attribute?.uuid) return;
                    onSetAttribute(attribute.uuid, attrName, attrValue);
                }}
                filterType="exclude"
                excludeAttribute={['componentType', 'x', 'y', 'valueType', 'uuid']}
                attributeComponentMapper={{
                    fontColor: [
                        {
                            name: '',
                            component: ColorPickerButton,
                        },
                    ],
                    fontName: [
                        {
                            name: '',
                            component: BaseNativeSelection,
                            props: {
                                options: [
                                    { label: 'Microsoft JhengHei', value: 'Microsoft JhengHei' },
                                    { label: 'Arial', value: 'Arial' },
                                ],
                            },
                        },
                    ],
                    fontWeight: [
                        {
                            name: '',
                            component: BaseNativeSelection,
                            props: {
                                options: [
                                    { label: 'Thin', value: 200 },
                                    { label: 'Normal', value: 400 },
                                    { label: 'Bold', value: 800 },
                                ],
                            },
                        },
                    ],
                    fontStyle: [
                        {
                            name: '',
                            component: BaseNativeSelection,
                            props: {
                                options: [
                                    { label: 'Normal', value: 'normal' },
                                    // { label: 'Italic', value: 'italic' },
                                ],
                            },
                        },
                    ],
                }}
            />
        </Stack>
    );
};

export default ReportComponentSelector;
