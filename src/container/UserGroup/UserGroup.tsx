import React, { useContext, useEffect, useRef, useState } from 'react';

import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import classes from './UserGroup.module.scss';
import { httpReq } from '../../axios/axios';
import FilterRuleVisualizationChart from '../../components/FilterRuleVisualizationChart/FilterRuleVisualizationChart';
import { define } from '../../constant/setting-define';
import { NotificationContext } from '../../context/notification-context';
import { FieldFilterTreeNode } from '../../interface/field-filter-tree-node';
import { MessageType } from '../../interface/notification';
import { ApplyFieldFilter, FieldFilter, UserGroup } from '../../interface/user-group';
import { UserIdInUserGroup } from '../../interface/userId-in-userGroup';
import GridTableEditor from '../../layout/GridTableEditor/GridTableEditor';

const UserGroupComp = () => {
    const { openNotification: setNotification } = useContext(NotificationContext);
    const [selectedUserGroup, setSelectedUserGroup] = useState<string | undefined>(undefined);
    const [fieldFilterList, setFieldFilter] = useState<ApplyFieldFilter[]>([]);
    const [userList, setUserList] = useState<UserIdInUserGroup[]>([]);
    const [treeNode, setTreeNode] = React.useState<FieldFilterTreeNode | undefined | null>(
        undefined,
    );
    const gridApiRef = useRef<GridApi>();

    // 選擇 User Group
    const onSelectionChanged = (gridApi: GridApi) => {
        gridApiRef.current = gridApi;
        const selectedRow = gridApi.getSelectedRows()[0] as UserGroup;
        if (!selectedRow || !selectedRow?.Name) {
            setFieldFilter([]);
            setUserList([]);
            setSelectedUserGroup(undefined);
            setTreeNode(undefined);
            return;
        }

        setSelectedUserGroup(selectedRow.Name);
    };

    // 套用Field Filter
    const onToggleFilterOnUserGroup = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldFilter: string,
    ) => {
        httpReq<FieldFilter[]>()({
            method: e.target.checked ? 'post' : 'delete',
            url: `api/usergroup/${selectedUserGroup}/applyFieldFilter`,
            data: { UserGroup: selectedUserGroup, FieldFilter: fieldFilter },
        }).subscribe({
            next: () => {
                setFieldFilter((prev) => {
                    return prev.map((x) => {
                        if (x.Name === fieldFilter) return { ...x, IsApply: !e.target.checked };
                        return x;
                    });
                });
            },
            error: (err) => {
                setNotification(MessageType.Error, err.response?.data.Message || err.message);
            },
        });
    };

    // 當selectedUserGroup改變時，重新取得Field Filter與User List
    useEffect(() => {
        if (!selectedUserGroup) return;

        const subscription = forkJoin([
            // 取得套用的Field Filter
            httpReq<ApplyFieldFilter[]>()({
                method: 'get',
                url: `api/usergroup/${selectedUserGroup}/filters`,
            }).pipe(
                catchError((err) => {
                    setNotification(MessageType.Error, err.response?.data.Message || err.message);
                    return of(null);
                }),
            ),
            // 取得誰在這個User Group
            httpReq<UserIdInUserGroup[]>()({
                method: 'get',
                url: `api/usergroup/${selectedUserGroup}/users`,
            }).pipe(
                catchError((err) => {
                    setNotification(MessageType.Error, err.response?.data.Message || err.message);
                    return of(null);
                }),
            ),
            // 取得Filter Rule Tree Node
            httpReq<FieldFilterTreeNode>()({
                method: 'get',
                url: `/api/usergroup/${selectedUserGroup}/rulesChart`,
            }).pipe(
                catchError((err) => {
                    setNotification(MessageType.Error, err.response?.data.Message || err.message);
                    return of(null);
                }),
            ),
        ]).subscribe(([fieldFilterRes, userListRes, filterRuleNodeRes]) => {
            if (fieldFilterRes) {
                setFieldFilter(fieldFilterRes.data);
            }
            if (userListRes) {
                setUserList(userListRes.data);
            }
            setTreeNode(filterRuleNodeRes?.data);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedUserGroup, setNotification]);

    return (
        <>
            <Stack direction="column" spacing={1} sx={{ height: '100%', width: '100%' }}>
                <Paper elevation={3} className="gridTableEditorContainer">
                    <Typography variant="h5" gutterBottom component="div" className="header">
                        User Group
                    </Typography>
                    <GridTableEditor
                        apiPath="UserGroup"
                        identityId="Name"
                        initFormData={{}}
                        colDef={define.userGroup.colDef}
                        formDef={define.userGroup.formDef}
                        onSelectionChanged={onSelectionChanged}
                    />
                </Paper>
                <Stack direction="row" spacing={1} sx={{ height: '100%', width: '100%' }}>
                    <Paper elevation={3} className="gridTableEditorContainer">
                        {/* Function List */}
                        <div className={classes.functionContent}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                component="div"
                                className="header"
                            >
                                Apply Filter List
                            </Typography>
                            <List
                                sx={{
                                    width: '100%',
                                    bgcolor: 'background.paper',
                                    borderRadius: '8px',
                                }}
                            >
                                {fieldFilterList.map((data) => {
                                    return (
                                        <div key={data.Name}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={data.Name}
                                                    secondary={data.Description}
                                                />
                                                <Switch
                                                    edge="end"
                                                    onChange={(e) =>
                                                        onToggleFilterOnUserGroup(e, data.Name)
                                                    }
                                                    checked={data.IsApply}
                                                />
                                            </ListItem>
                                            <Divider
                                                sx={{
                                                    marginLeft: '0',
                                                    borderColor: 'rgb(88 86 82 / 50%)',
                                                }}
                                                variant="inset"
                                                component="li"
                                            />
                                        </div>
                                    );
                                })}
                            </List>
                        </div>
                    </Paper>
                    <Paper elevation={3} className="gridTableEditorContainer">
                        {/* Function List */}
                        <div className={classes.functionContent}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                component="div"
                                className="header"
                            >
                                User In This Group
                            </Typography>
                            <List
                                sx={{
                                    width: '100%',
                                    bgcolor: 'background.paper',
                                    borderRadius: '8px',
                                }}
                            >
                                {userList.map((data) => {
                                    return (
                                        <div key={data.UserID}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={data.UserID}
                                                    secondary={data.DoctorEName}
                                                />
                                            </ListItem>
                                            <Divider
                                                sx={{
                                                    marginLeft: '0',
                                                    borderColor: 'rgb(88 86 82 / 50%)',
                                                }}
                                                variant="inset"
                                                component="li"
                                            />
                                        </div>
                                    );
                                })}
                            </List>
                        </div>
                    </Paper>
                </Stack>
            </Stack>
            <Paper elevation={3} className="gridTableEditorContainer" sx={{ maxWidth: '40%' }}>
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

export default UserGroupComp;
