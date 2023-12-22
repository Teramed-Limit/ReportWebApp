import * as React from 'react';
import { useCallback, useContext, useEffect, useState } from 'react';

import { Cancel } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { IconButton, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { observer } from 'mobx-react';

import classes from './CodeListTab.module.scss';
import { deleteCodeListByCodeName } from '../../../axios/api';
import { define } from '../../../constant/setting-define';
import { ModalContext } from '../../../context/modal-context';
import { NotificationContext } from '../../../context/notification-context';
import { CodeList } from '../../../interface/code-list';
import { MessageType } from '../../../interface/notification';
import GridTableEditor from '../../../layout/GridTableEditor/GridTableEditor';
import { useOptionStore } from '../../../models/useStore';
import AddCodeNameModal from '../../Modals/AddCodeNameModal/AddCodeNameModal';
import MessageModal from '../../Modals/MessageModal/MessageModal';

const CodeListTab = () => {
    // Context
    const { openNotification: setNotification } = useContext(NotificationContext);
    const setModal = useContext(ModalContext);

    // Store
    const { getExcludeCodeListMap, fetchCodeList, deleteCodeList } = useOptionStore();

    // State
    const [selectCodeName, setSelectCodeName] = useState<string>('');
    const [selectCodeList, setSelectCodeList] = useState<CodeList[]>([]);

    // Effect
    // 初始化時取得第一個CodeName的CodeList
    useEffect(() => {
        const excludeCodeListMap = getExcludeCodeListMap(['UserAccount']);

        const firstCodeName = Object.keys(excludeCodeListMap)[0];
        const firstCodeList = Object.values(excludeCodeListMap)[0];

        if (!firstCodeName || !firstCodeList) return;

        onCodeNameClick(firstCodeName, firstCodeList);
    }, [getExcludeCodeListMap]);

    // Function
    // 選擇CodeName時，取得該CodeName的CodeList
    const onCodeNameClick = (codeName: string, codeList: CodeList[]) => {
        setSelectCodeName(codeName);
        setSelectCodeList(codeList);
    };

    // 刪除整個CodeList
    const onDeleteCodeListByCodeName = () => {
        setModal(
            <MessageModal
                headerTitle="Message"
                bodyContent="Are you sure to delete whole code list?"
                onConfirmCallback={() =>
                    deleteCodeListByCodeName(selectCodeName).subscribe({
                        next: () => {
                            setSelectCodeName('');
                            setSelectCodeList([]);
                        },
                        error: (err) => {
                            setNotification(
                                MessageType.Error,
                                err.response?.data.Message || err.message,
                            );
                        },
                    })
                }
            />,
        );
    };

    // 刪除整個CodeList
    const handleDelete = () => {
        setModal(
            <MessageModal
                headerTitle="Message"
                bodyContent="Are you sure to delete whole code list?"
                onConfirmCallback={() => {
                    deleteCodeList(selectCodeName);
                    setSelectCodeName('');
                    setSelectCodeList([]);
                }}
            />,
        );
    };

    // 開啟新增CodeName的Modal
    const openCategoryModel = useCallback(() => {
        setModal(<AddCodeNameModal initCodeListMap={() => fetchCodeList()} />);
    }, [fetchCodeList, setModal]);

    return (
        <Stack direction="row" className={classes.container}>
            <List
                sx={{ bgcolor: 'background.paper' }}
                className={classes.sidebar}
                component="nav"
                subheader={
                    <ListSubheader
                        sx={{
                            display: 'flex',
                            fontSize: '20px',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                        component="div"
                    >
                        <div>Code Name</div>
                        <IconButton onClick={openCategoryModel}>
                            <AddCircleIcon />
                        </IconButton>
                    </ListSubheader>
                }
            >
                {Object.entries(getExcludeCodeListMap(['UserAccount'])).map(
                    ([codeName, codeList]) => {
                        return (
                            <ListItemButton
                                key={codeName}
                                selected={codeName === selectCodeName}
                                onClick={onCodeNameClick.bind(null, codeName, codeList)}
                            >
                                <ListItemText primary={codeName} />
                            </ListItemButton>
                        );
                    },
                )}
            </List>

            <Card
                sx={{
                    padding: '0 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                }}
            >
                <CardHeader
                    sx={{ p: 1 }}
                    title={selectCodeName}
                    action={
                        <IconButton onClick={handleDelete}>
                            <Cancel />
                        </IconButton>
                    }
                />
                <CardContent sx={{ display: 'flex', width: '100%', flex: '1', p: 1 }}>
                    <GridTableEditor
                        initRowData={selectCodeList}
                        apiPath="codelist"
                        identityId="Id"
                        colDef={define.codeList.colDef}
                        formDef={define.codeList.formDef}
                        deleteCallBack={fetchCodeList}
                        addCallBack={fetchCodeList}
                        updateCallBack={fetchCodeList}
                        initFormData={{ CodeName: selectCodeName }}
                    />
                </CardContent>
            </Card>
        </Stack>
    );
};

export default observer(CodeListTab);
