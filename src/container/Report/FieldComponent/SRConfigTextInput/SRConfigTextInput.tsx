import React, { useContext, useEffect, useRef, useState } from 'react';

import { ClickAwayListener } from '@mui/base';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoadingButton } from '@mui/lab';
import {
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TreeView } from '@mui/x-tree-view/TreeView';
import * as R from 'ramda';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { SRTreeItem } from './SRTreeItem/SRTreeItem';
import {
    selectedAttributeAtom,
    selectedAttributePathAtom,
    selectedReportDefine,
    structureReportAtom,
} from '../../../../atom/report-generator';
import { loadSRFile } from '../../../../axios/api';
import FileUpload from '../../../../components/FileUpload/FileUpload';
import BaseTextInput from '../../../../components/UI/BaseTextInput/BaseTextInput';
import { NotificationContext } from '../../../../context/notification-context';
import { MessageType } from '../../../../interface/notification';
import { SRTextField } from '../../../../interface/report-field/sr-text-field';
import { SRTreeNode } from '../../../../interface/sr-tree';
import { generateUUID, isEmptyOrNil, isNotEmptyOrNil } from '../../../../utils/general';

interface Props {
    field: SRTextField;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SRConfigTextInput = React.forwardRef(
    ({ field, value, onValueChange, disabled }: Props, ref) => {
        const { openNotification: setNotification } = useContext(NotificationContext);

        // Form Define Setter
        const attributePath = useRecoilValue(selectedAttributePathAtom);
        const setAttribute = useSetRecoilState(selectedAttributeAtom);
        const setFormDefine = useSetRecoilState(selectedReportDefine);
        const onSetAttribute = (attrValue: number | string | boolean) => {
            const path = ['structureReportPath'];
            setAttribute((pre) => {
                return R.assocPath(path, attrValue, pre);
            });
            setFormDefine((pre) => {
                return R.assocPath([...attributePath, ...path], attrValue, pre);
            });
        };

        // SR
        const [loadingSR, setLoadingSR] = useState(false);
        const [structureReportData, setStructureReportAtom] = useRecoilState(structureReportAtom);

        // Search
        const inputSubject = new Subject<string>();
        const [searchTerm, setSearchTerm] = useState('');
        const [searchType, setSearchType] = useState<'Code' | 'Value'>('Value');
        const [expanded, setExpanded] = useState<string[]>(['root']);

        // Node Mapper
        const nodeMap = useRef({}).current;

        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);
        const id = open ? 'simple-popper' : undefined;

        // Event Handlers
        const onValueChangeHandler = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const onFocusHandler = (event) => {
            setExpanded(['root']);
            setAnchorEl(event.currentTarget);
        };

        // 讀取SR檔案
        const loadStructureReportFile = (file: File) => {
            setLoadingSR(true);
            const formData = new FormData();
            formData.append('File', file);
            loadSRFile(formData).subscribe({
                next: (res) => {
                    setLoadingSR(false);
                    setStructureReportAtom(res.data);
                },
                error: (err) => {
                    setLoadingSR(false);
                    setNotification(MessageType.Error, err.response?.data.Message || err.message);
                },
            });
        };

        // 獲取SR節點路徑的函數
        const getSRNodePath = (nodeId: string, type: 'Value' | 'ValueWithUnit') => {
            const selectNode: SRTreeNode = nodeMap[nodeId];

            // 獲取選取節點的第一個節點
            // 將第一個節點的Value作為條件
            // 在將選取的節點的子節點當作條件
            let currentNode: SRTreeNode = selectNode;
            if (!currentNode?.Value) return undefined;

            // 通過迴圈追溯父節點，並將父節點的值加到路徑中
            const pathList: string[] = [];

            while (currentNode && currentNode.Parent) {
                // 將第一個節點作為條件
                let conditionPath = '';
                if (currentNode.Children[0]) {
                    const conditionNode = currentNode.Children[0];
                    if (!conditionNode.Value.Unit) {
                        conditionPath = `|${conditionNode.Value.Code}=${conditionNode.Value.Value}`;
                        // pathList.push(conditionPath);
                    }
                }

                // 加入目前的節點
                if (currentNode.NodeId === nodeId) {
                    // pathList.push(`${currentNode.Value.Code}#${type}`);
                    pathList.push(`${currentNode.Value.Code}#${type}${conditionPath}`);
                } else {
                    pathList.push(`${currentNode.Value.Code}${conditionPath}`);
                }

                // 更新當前節點為其父節點，以便在下一次迴圈中繼續追溯
                currentNode = nodeMap[currentNode.Parent.NodeId];
            }

            // 將root節點加入路徑
            pathList.push(`${currentNode.Value.Code}`);

            // 組合為SR的路徑
            onSetAttribute(pathList.reverse().reduce((a, b) => `${a}\\${b}`));
        };

        // 渲染樹形結構的函數
        const renderTreeValue = (nodes: SRTreeNode) => {
            nodeMap[nodes.NodeId] = nodes;
            return Object.keys(nodes.Value)
                .filter((k) => k !== 'Code')
                .filter((k) => k !== 'ValueType')
                .filter((k) => nodes.Value[k] !== null)
                .map((key) => {
                    // if (nodes.Value[key] === null) return null;
                    return (
                        <TreeItem
                            // sx={{ color: found ? 'red' : 'black' }}
                            key={generateUUID()}
                            nodeId={generateUUID()}
                            label={`${key}: ${nodes.Value?.[key]}`}
                        ></TreeItem>
                    );
                });
        };

        const onSearchChange = (event) => {
            inputSubject.next(event.target.value);
        };

        // 使用useEffect進行事件訂閱和清理
        useEffect(() => {
            const subscription = inputSubject
                .pipe(
                    map((v) => (v.length >= 2 ? v : '')),
                    debounceTime(300), // 設置 debounce 時間為 500 毫秒
                )
                .subscribe((debouncedValue) => {
                    setSearchTerm(debouncedValue);
                    if (isEmptyOrNil(debouncedValue)) return;
                    setExpanded(Object.keys(nodeMap));
                });

            // 清理訂閱
            return () => {
                subscription.unsubscribe();
            };
        }, [inputSubject, nodeMap]);

        const onExpandClick = () => {
            if (!structureReportData) return;
            setExpanded((oldExpanded) => (oldExpanded.length === 0 ? Object.keys(nodeMap) : []));
        };

        // 檢查節點是否匹配篩選條件
        const matchFilter = (node: SRTreeNode, type: 'Code' | 'Value'): boolean => {
            // 如果當前節點匹配，返回 true
            if (
                node?.Value[type] &&
                node?.Value[type]?.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                return true;
            }
            // 否則，遞迴檢查子節點
            return node?.Children && node?.Children?.some((child) => matchFilter(child, type));
        };

        const renderTree = (currentNode: SRTreeNode) => {
            if (isNotEmptyOrNil(searchTerm)) {
                // 如果是找節點的Code
                if (searchType === 'Code') {
                    // 先檢查節點的Code是否匹配篩選條件
                    const selfMatch = matchFilter(currentNode, searchType);

                    // 如果有子節點，檢查子節點是否有匹配篩選條件
                    const isSomeChildMatching = currentNode.Children.some((child) =>
                        matchFilter(child, searchType),
                    );

                    // 如果此節點為Value節點，考慮上層節點的Code是否匹配篩選條件
                    if (
                        isNotEmptyOrNil(currentNode.Value.Value) &&
                        matchFilter(currentNode.Parent as SRTreeNode, searchType)
                    ) {
                        return (
                            <SRTreeItem
                                key={currentNode.NodeId}
                                nodeId={currentNode.NodeId}
                                node={currentNode}
                                label={currentNode.Value.Code}
                                getSRNodePath={getSRNodePath}
                            >
                                {renderTreeValue(currentNode)}
                            </SRTreeItem>
                        );
                    }

                    // 如果自己和子節點都不匹配篩選條件，則不顯示當前節點
                    if (!selfMatch && !isSomeChildMatching) return null;
                }

                // 如果是找節點的Value
                if (searchType === 'Value') {
                    // 比較目前節點的Value是否匹配篩選條件
                    const isCurrentNodeMatching = matchFilter(currentNode, searchType);

                    // 檢查是否有子節點，且考慮子節點是否匹配篩選條件
                    const isSomeChildNodeMatching = currentNode?.Children.some((child) =>
                        matchFilter(child, searchType),
                    );

                    // 如果當前節點的父節點有Value，則要顯示此節點
                    const isParentNodeHasValue = isNotEmptyOrNil(currentNode?.Parent?.Value?.Value);

                    // 不顯示當前節點
                    if (
                        !isSomeChildNodeMatching &&
                        !isCurrentNodeMatching &&
                        !isParentNodeHasValue
                    ) {
                        return null;
                    }
                }
            }

            return (
                <SRTreeItem
                    key={currentNode.NodeId}
                    nodeId={currentNode.NodeId}
                    node={currentNode}
                    label={currentNode.Value.Code}
                    getSRNodePath={getSRNodePath}
                >
                    {renderTreeValue(currentNode)}
                    {Array.isArray(currentNode.Children)
                        ? currentNode.Children.map((node) => renderTree(node))
                        : null}
                </SRTreeItem>
            );
        };

        return (
            <>
                <BaseTextInput
                    id={field.id}
                    placeholder={field?.placeholder || ''}
                    disabled={disabled || field.readOnly}
                    value={value}
                    onValueChange={onValueChange}
                    onKeyPress={onValueChangeHandler}
                    onFocus={onFocusHandler}
                    prefix={field.prefix}
                    suffix={field.suffix}
                />
                {!structureReportData ? (
                    <FileUpload
                        accept={'.dcm'}
                        uiComponent={
                            <LoadingButton
                                sx={{ padding: 0 }}
                                size="small"
                                loading={loadingSR}
                                variant="contained"
                            >
                                Open SR
                            </LoadingButton>
                        }
                        onFileChange={loadStructureReportFile}
                    ></FileUpload>
                ) : (
                    <IconButton
                        sx={{ padding: '2px', minWidth: '20px', minHeight: '20px' }}
                        size="small"
                        color="error"
                        onClick={() => setStructureReportAtom(undefined)}
                    >
                        <RiDeleteBin6Fill />
                    </IconButton>
                )}
                <ClickAwayListener
                    mouseEvent="onMouseDown"
                    touchEvent="onTouchStart"
                    onClickAway={() => {
                        setAnchorEl(null);
                        setSearchTerm('');
                    }}
                >
                    {structureReportData ? (
                        <Popper
                            id={id}
                            sx={{ zIndex: '1000' }}
                            open={open}
                            anchorEl={anchorEl}
                            disablePortal={false}
                        >
                            <Paper
                                elevation={24}
                                sx={{
                                    border: '1px solid darkgrey',
                                    m: 1,
                                    p: 1,
                                    bgcolor: 'background.paper',
                                    overflow: 'auto',
                                    maxHeight: 400,
                                    zIndex: 1001,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1100, // Ensure the box stays on top
                                        backgroundColor: 'white',
                                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                        padding: '0px 8px',
                                    }}
                                >
                                    <FormControl
                                        size={'small'}
                                        sx={{ mr: '4px', minWidth: '120px' }}
                                    >
                                        <InputLabel>Search Type</InputLabel>
                                        <Select
                                            value={searchType}
                                            label="Search Type"
                                            onChange={(e) => {
                                                setSearchType(e.target.value as 'Code' | 'Value');
                                            }}
                                        >
                                            <MenuItem value={'Value'}>Value</MenuItem>
                                            <MenuItem value={'Code'}>Code</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        size={'small'}
                                        label="Term"
                                        variant="outlined"
                                        onChange={onSearchChange}
                                    />
                                    <Box>
                                        <Button onClick={onExpandClick}>
                                            {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
                                        </Button>
                                    </Box>
                                </Box>
                                <TreeView
                                    sx={{ padding: 2 }}
                                    expanded={expanded}
                                    onNodeToggle={(_, nodeIds: string[]) => setExpanded(nodeIds)}
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                >
                                    {renderTree(structureReportData)}
                                </TreeView>
                            </Paper>
                        </Popper>
                    ) : (
                        <></>
                    )}
                </ClickAwayListener>
            </>
        );
    },
);

export default SRConfigTextInput;
