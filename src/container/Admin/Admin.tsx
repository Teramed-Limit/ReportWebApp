import React, { useContext, useState } from 'react';

import { AppBar, IconButton, Tab, Tabs } from '@mui/material';
import { GridApi } from 'ag-grid-community';
import { AxiosError } from 'axios';
import { FaSearch } from 'react-icons/all';
import { first } from 'rxjs/operators';

import { fetchDoctorSignature, fetchServiceLog, fetchStudiesStatus } from '../../axios/api';
import { CellMapper } from '../../components/GridTable/GridCell/cell-mapper';
import GridTable from '../../components/GridTable/GridTable';
import TabPanel from '../../components/TabPanel/TabPanel';
import { NotificationContext } from '../../context/notification-context';
import { ListEpisodeNoStatusDto, SignatureData } from '../../interface/ers-log';
import { isEmptyOrNil } from '../../utils/general';
import classes from './Admin.module.scss';
import '../../styles/ag-grid/ag-theme-logger.scss';
import { LogColDef } from './log-column-define';

const tabList = [
    { name: 'END001', id: 0 },
    { name: 'END002', id: 1 },
    { name: 'END003', id: 2 },
    { name: 'END004', id: 3 },
    { name: 'END005', id: 4 },
];

const Admin = () => {
    const { setErrorNotification } = useContext(NotificationContext);
    const [searchValue, setSearchValue] = useState('');
    const [episodeNo, setEpisodeNo] = useState('');
    const [log, setLog] = useState('');
    const [rowData, setRowData] = useState<ListEpisodeNoStatusDto[]>([]);
    const [signatureData, setSignatureData] = useState<SignatureData | undefined>(undefined);
    const [tabIdx, setTabIdx] = React.useState(0);

    const onTabSwitch = (activeTabIdx: number) => {
        if (isEmptyOrNil(episodeNo)) return;
        setTabIdx(activeTabIdx);
        fetchServiceLog(episodeNo, tabList[activeTabIdx].name)
            .pipe(first())
            .subscribe(
                (res) => {
                    setLog(res.data);
                },
                (error: AxiosError) => {
                    setLog(error.response?.data.Message || '');
                },
            );
    };

    const onSelectionChanged = (gridApi: GridApi) => {
        let staffCode;
        gridApi.getSelectedNodes().forEach((node) => {
            staffCode = (node.data as ListEpisodeNoStatusDto).Author;
        });
        if (!staffCode) return;
        onTabSwitch(0);
        fetchDoctorSignature(staffCode).subscribe(
            (res) => {
                setSignatureData(res.data);
            },
            (error: AxiosError) => {
                setSignatureData(undefined);
                setErrorNotification(error.response?.data.Message || 'Error occurs');
            },
        );
    };

    const onSearch = () => {
        fetchStudiesStatus(searchValue)
            .pipe(first())
            .subscribe(
                (res) => {
                    setLog('');
                    setEpisodeNo(searchValue);
                    setRowData(res.data.ListEpisodeNoStatusDto);
                },
                (error: AxiosError) => {
                    setLog('');
                    setEpisodeNo('');
                    setRowData([]);
                    setErrorNotification(error.response?.data.Message || 'Error occurs');
                },
            );
    };

    return (
        <div className={classes.container}>
            <div className={classes.searchBar}>
                <input
                    type="text"
                    placeholder="EpisodeNo..."
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                />
                <IconButton
                    className={classes.searchIcon}
                    color="primary"
                    component="span"
                    onClick={onSearch}
                    size="large">
                    <FaSearch />
                </IconButton>
            </div>
            <div className={`${classes.grid} ag-theme-logger`}>
                <GridTable
                    columnDefs={LogColDef}
                    rowData={rowData}
                    disabled={false}
                    rowSelection="single"
                    onSelectionChanged={onSelectionChanged}
                    frameworkComponents={CellMapper}
                />
            </div>
            <div className={classes.content}>
                <div className={classes.logArea}>
                    <AppBar position="static">
                        <Tabs value={tabIdx} onChange={(e, v) => onTabSwitch(v)}>
                            {tabList.map((tab) => (
                                <Tab key={tab.id} label={tab.name} />
                            ))}
                        </Tabs>
                    </AppBar>
                    {tabList.map((tab) => (
                        <TabPanel key={tab.id} value={tabIdx} index={tab.id}>
                            <textarea disabled value={log} />
                        </TabPanel>
                    ))}
                </div>
                <div className={classes.imgArea}>
                    <h1>Doctor Introduction</h1>
                    <h3>{signatureData?.UserID}</h3>
                    <h4>Experience:</h4>
                    <p>{signatureData?.Qualification}</p>
                    <h4>Signature:</h4>
                    <img src={signatureData?.SignatureImage} alt="No signature" />
                </div>
            </div>
        </div>
    );
};

export default Admin;
