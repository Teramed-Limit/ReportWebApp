import React, { useEffect, useState } from 'react';

import { Divider, Paper, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import { GridApi } from 'ag-grid-community/dist/lib/gridApi';
import { map } from 'rxjs/operators';

import classes from './UserRoles.module.scss';
import {
    addFunction,
    deleteFunction,
    getRoleFunctions,
    getRoleFunctionsWithRoleName,
} from '../../../axios/api';
import { define } from '../../../constant/setting-define';
import { RoleFunction, UserRole } from '../../../interface/user-role';
import GridTableEditor from '../../../layout/GridTableEditor/GridTableEditor';

let functionList;

const UserRoles = () => {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedRoleFunctionList, setSelectedRoleFunctionList] = useState<RoleFunction[]>([]);

    useEffect(() => {
        const subscription = getRoleFunctions()
            .pipe(map((res) => res.data.map((item) => ({ ...item, Checked: false }))))
            .subscribe((data) => {
                setSelectedRoleFunctionList(data);
                functionList = data;
            });
        return () => subscription.unsubscribe();
    }, []);

    const initFunctionList = () => {
        setSelectedRole('');
        setSelectedRoleFunctionList(functionList);
    };

    const onSelectionChanged = (gridApi: GridApi) => {
        const selectedRow = gridApi.getSelectedRows()[0] as UserRole;
        if (!selectedRow) return;

        setSelectedRole(selectedRow.RoleName);
        getRoleFunctionsWithRoleName(selectedRow.RoleName).subscribe({
            next: (res) => {
                setSelectedRoleFunctionList(() => {
                    return functionList.map((roleFunction) => {
                        const check = res.data.find(
                            (checkFunction) =>
                                roleFunction.FunctionName === checkFunction.FunctionName,
                        );
                        return { ...roleFunction, Checked: check !== undefined };
                    });
                });
            },
        });
    };

    const onFunctionChecked = (
        e: React.ChangeEvent<HTMLInputElement>,
        roleFunction: RoleFunction,
        roleName: string,
    ) => {
        if (roleName === '') return;

        const updateFunctionState = (checked: boolean) =>
            setSelectedRoleFunctionList((itemList) => {
                return itemList.map((item) => {
                    if (item.FunctionName === roleFunction.FunctionName) {
                        return { ...item, Checked: checked };
                    }
                    return item;
                });
            });

        if (e.target.checked) {
            addFunction(roleName, roleFunction.FunctionName).subscribe(() => {
                updateFunctionState(true);
            });
        } else {
            deleteFunction(roleName, roleFunction.FunctionName).subscribe(() => {
                updateFunctionState(false);
            });
        }
    };

    return (
        <div className={classes.container}>
            <Paper elevation={3} className={classes.leftContent}>
                <Typography
                    variant="h5"
                    gutterBottom
                    component="div"
                    className={classes.sectionHeader}
                >
                    Role
                </Typography>
                <GridTableEditor
                    apiPath="role"
                    identityId="RoleName"
                    initFormData={{}}
                    colDef={define.userRoleGroup.colDef}
                    formDef={define.userRoleGroup.formDef}
                    deleteCallBack={initFunctionList}
                    addCallBack={initFunctionList}
                    onSelectionChanged={onSelectionChanged}
                />
            </Paper>
            <Paper elevation={3} className={classes.rightContent}>
                {/* Function List */}
                <div className={classes.functionContent}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        component="div"
                        className={classes.sectionHeader}
                    >
                        Function
                    </Typography>
                    <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: '8px' }}>
                        {selectedRoleFunctionList.map((data) => {
                            return (
                                <div key={data.FunctionName}>
                                    <ListItem>
                                        <ListItemText
                                            primary={data.FunctionName}
                                            secondary={data.Description}
                                        />
                                        <Switch
                                            disabled={selectedRole === ''}
                                            edge="end"
                                            onChange={(e) =>
                                                onFunctionChecked(e, data, selectedRole)
                                            }
                                            checked={data.Checked}
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
        </div>
    );
};

export default UserRoles;
