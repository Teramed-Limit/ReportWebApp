import React, { useContext, useEffect, useState } from 'react';

import { ColDef, GridApi } from 'ag-grid-community';
import { AxiosError } from 'axios';
import { finalize, first } from 'rxjs/operators';

import { fetchStudies, mergeStudy } from '../../../axios/api';
import GridTable from '../../../components/GridTable/GridTable';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { NotificationContext } from '../../../context/notification-context';
import { Study } from '../../../interface/study';
import { useReportDataStore, useReportImageStore } from '../../../models/useStore';
import classes from './LoadStudyModal.module.scss';
import '../../../styles/ag-grid/ag-theme-modal.scss';

const colDef: ColDef[] = [
    { field: 'DataIndex', headerName: 'No.', width: 100 },
    { field: 'StudyDate', headerName: 'Study Date', width: 130, flex: 1 },
    { field: 'Modality', headerName: 'Modality', width: 130, flex: 1 },
    { field: 'StudyDescription', headerName: 'Study Description', width: 190, flex: 1 },
    { field: 'StudyInstanceUID', hide: true },
    { field: 'ReferencedStudyInstanceUID', hide: true },
];

const LoadStudyModal = () => {
    const setModal = useContext(ModalContext);
    const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
    const { user, studyInsUID, documentNumber } = useReportDataStore();
    const { setReportImage } = useReportImageStore();
    const [studyList, setStudyList] = useState<Study[]>([]);
    const [selectedStudy, setSelectedStudy] = useState<Study | undefined>(undefined);

    useEffect(() => {
        fetchStudies(documentNumber, studyInsUID)
            .pipe(first())
            .subscribe(({ data: studies }) => {
                setStudyList(studies);
            });
    }, [documentNumber, studyInsUID]);

    const onClose = () => {
        setModal(null);
    };

    const onMerge = () => {
        if (!selectedStudy) return;
        mergeStudy({
            RqRspType: 1,
            ModifyUser: user,
            MergeFromStudyUID: selectedStudy.StudyInstanceUID,
            MergeToStudyUID: studyInsUID,
        })
            .pipe(
                first(),
                finalize(() => onClose()),
            )
            .subscribe(
                ({ data: studies }) => {
                    setReportImage(studies);
                    setSuccessNotification('Merged success');
                },
                (error: AxiosError<{ Message: string }>) => {
                    setErrorNotification(error.response?.data.Message || 'Error occurs');
                },
            );
    };

    const onSelectionChanged = (gridApi: GridApi) => {
        const selectedNodes = gridApi.getSelectedNodes();
        if (selectedNodes.length === 0) {
            setSelectedStudy(undefined);
            return;
        }

        selectedNodes.forEach((node) => {
            setSelectedStudy(node.data);
        });
    };

    const body = (
        <div className={classes.container}>
            <div className={`${classes.grid} ag-theme-modal`}>
                <GridTable
                    columnDefs={colDef}
                    rowData={studyList}
                    rowSelection="single"
                    onSelectionChanged={onSelectionChanged}
                />
            </div>
        </div>
    );
    const footer = (
        <>
            <Button theme="primary" disabled={!selectedStudy} onClick={() => onMerge()}>
                Merge
            </Button>
            <Button theme="reversePrimary" onClick={() => onClose()}>
                Cancel
            </Button>
        </>
    );

    return (
        <Modal
            open
            width="60%"
            height="50%"
            onClose={() => onClose()}
            headerTitle="Load Study"
            body={body}
            footer={footer}
        />
    );
};

export default LoadStudyModal;
