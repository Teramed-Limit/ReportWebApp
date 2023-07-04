import React, { useCallback, useRef, useState } from 'react';

import { Box, Paper, Stack, Typography } from '@mui/material';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { forkJoin, Subscription } from 'rxjs';

import classes from './FieldFilterRule.module.scss';
import { httpReq } from '../../../axios/axios';
import FilterRuleVisualizationChart from '../../../components/FilterRuleVisualizationChart/FilterRuleVisualizationChart';
import { define } from '../../../constant/setting-define';
import { FieldFilterTreeNode } from '../../../interface/field-filter-tree-node';
import { FieldFilter, FieldFilterRule } from '../../../interface/user-group';
import GridTableEditor from '../../../layout/GridTableEditor/GridTableEditor';

const FieldFilterRuleComp = () => {
    const [rules, setRules] = useState<FieldFilterRule[]>([]);
    const [treeNode, setTreeNode] = React.useState<FieldFilterTreeNode | undefined | null>(
        undefined,
    );
    const [initFormData, setInitFormData] = useState<Partial<FieldFilterRule> | undefined>(
        undefined,
    );
    const subscription = useRef<Subscription | null>(null);
    const selectedFilterGroup = useRef<string | undefined>(undefined);

    const fetchFilterRulesAndTreeNode = (filterName: string) => {
        // 取得UserGroup的套用Field FilterNode
        const fieldFilterNode$ = httpReq<FieldFilterTreeNode>()({
            method: 'get',
            url: `/api/FieldFilter/${filterName}/rulesChart`,
        });

        // 取得UserGroup的套用Field Filter
        const fieldFilterRule$ = httpReq<FieldFilterRule[]>()({
            method: 'get',
            url: `api/FieldFilterRule/${filterName}/rules`,
        });

        subscription.current = forkJoin([fieldFilterNode$, fieldFilterRule$]).subscribe({
            next: ([fieldFilterNodeRes, fieldFilterRuleRes]) => {
                // tree node observable
                setTreeNode(fieldFilterNodeRes.data);

                // rules observable 的结果
                setRules(fieldFilterRuleRes.data);
                setInitFormData({
                    Operator: 'foEqual',
                    AndOr: 'coAnd',
                    BundleConditionStart: false,
                    BundleConditionEnd: false,
                    FieldFilterName: filterName,
                });
            },
            error: () => {},
        });
    };

    const resetFilterRules = () => {
        if (selectedFilterGroup.current) fetchFilterRulesAndTreeNode(selectedFilterGroup.current);
    };

    const onSelectionChanged = useCallback((gridApi: GridApi) => {
        if (subscription.current) subscription.current.unsubscribe();

        const selectedRow = gridApi.getSelectedRows()[0] as FieldFilter;
        if (!selectedRow) {
            setRules([]);
            setTreeNode(undefined);
            setInitFormData(undefined);
            selectedFilterGroup.current = undefined;
            return;
        }

        selectedFilterGroup.current = selectedRow.Name;
        fetchFilterRulesAndTreeNode(selectedRow.Name);
    }, []);

    return (
        <>
            <Stack direction="column" spacing={1} sx={{ height: '100%', width: '100%' }}>
                <Paper elevation={3} className="gridTableEditorContainer">
                    <Typography variant="h5" gutterBottom component="div" className="header">
                        Field Filter
                    </Typography>
                    <GridTableEditor
                        apiPath="FieldFilter"
                        identityId="Name"
                        colDef={define.filterField.colDef}
                        formDef={define.filterField.formDef}
                        initFormData={{}}
                        onSelectionChanged={onSelectionChanged}
                        deleteCallBack={() => {
                            selectedFilterGroup.current = undefined;
                        }}
                    />
                </Paper>
                <Paper elevation={3} className="gridTableEditorContainer">
                    <Typography variant="h5" gutterBottom component="div" className="header">
                        Rules
                    </Typography>
                    <GridTableEditor
                        apiPath="FieldFilterRule"
                        identityId="Id"
                        enableButtonBar={initFormData !== undefined}
                        colDef={define.filterFieldRule.colDef}
                        formDef={define.filterFieldRule.formDef}
                        addCallBack={resetFilterRules}
                        deleteCallBack={resetFilterRules}
                        updateCallBack={resetFilterRules}
                        initRowData={rules}
                        initFormData={initFormData}
                    />
                </Paper>
            </Stack>
            <Paper elevation={3} className="gridTableEditorContainer" sx={{ maxWidth: '30%' }}>
                <Typography variant="h5" gutterBottom component="div" className="header">
                    Rules Visualization Chart
                </Typography>
                <Box sx={{ overflow: 'auto' }}>
                    {treeNode && <FilterRuleVisualizationChart treeNode={treeNode} />}
                    {treeNode === null && <div className={classes.error}>Error</div>}
                </Box>
            </Paper>
        </>
    );
};

export default FieldFilterRuleComp;
