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

import { deleteCodeListByCodeName, fetchCodeList } from '../../../axios/api';
import { define } from '../../../constant/setting-define';
import { ModalContext } from '../../../context/modal-context';
import { CodeList, CodeListMap } from '../../../interface/code-list';
import GridTableEditor from '../../../layout/GridTableEditor/GridTableEditor';
import { useOptionStore } from '../../../models/useStore';
import AddCodeNameModal from '../../Modals/AddCodeNameModal/AddCodeNameModal';
import classes from './CodeListTab.module.scss';

const CodeListTab = () => {
    const setModal = useContext(ModalContext);
    const { setCodeListMap: setReportCodeListMap } = useOptionStore();
    const [codeListMap, setCodeListMap] = React.useState({});
    const [selectCodeName, setSelectCodeName] = useState<string>('');
    const [selectCodeList, setSelectCodeList] = useState<CodeList[]>([]);

    const initCodeListMap = useCallback(() => {
        fetchCodeList().subscribe((res) => {
            const data = res.data as CodeListMap;
            setCodeListMap(data);
            setReportCodeListMap(data);
        });
    }, [setReportCodeListMap]);

    const onDeleteCodeListByCodeName = () => {
        deleteCodeListByCodeName(selectCodeName).subscribe(() => {
            initCodeListMap();
            setSelectCodeName('');
            setSelectCodeList([]);
        });
    };

    const openCategoryModel = useCallback(() => {
        setModal(<AddCodeNameModal initCodeListMap={() => initCodeListMap()} />);
    }, [initCodeListMap, setModal]);

    useEffect(() => {
        const subscription = fetchCodeList().subscribe((res) => {
            const data = res.data as CodeListMap;
            setCodeListMap(data);

            if (Object.keys(data).length === 0) return;

            const firstKey = Object.keys(data)[0];
            setSelectCodeName(firstKey);
            setSelectCodeList(data[firstKey]);
        });
        return () => subscription.unsubscribe();
    }, []);

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
                {Object.keys(codeListMap).map((codeName) => {
                    return (
                        <ListItemButton
                            key={codeName}
                            selected={codeName === selectCodeName}
                            onClick={() => {
                                setSelectCodeName(codeName);
                                setSelectCodeList(codeListMap[codeName]);
                            }}
                        >
                            <ListItemText primary={codeName} />
                        </ListItemButton>
                    );
                })}
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
                        <IconButton onClick={onDeleteCodeListByCodeName}>
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
                        deleteCallBack={initCodeListMap}
                        addCallBack={initCodeListMap}
                        initFormData={{ Id: '999', CodeName: selectCodeName }}
                    />
                </CardContent>
            </Card>
        </Stack>
    );
};

export default observer(CodeListTab);
