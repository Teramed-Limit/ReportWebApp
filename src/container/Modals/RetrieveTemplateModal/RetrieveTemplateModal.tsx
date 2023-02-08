import React, { useContext, useEffect, useRef, useState } from 'react';

import { TextField } from '@mui/material';
import { ColDef, GridApi } from 'ag-grid-community';
import { AxiosResponse } from 'axios';
import { BiError } from 'react-icons/bi';
import { Subject } from 'rxjs';
import { debounceTime, first, map } from 'rxjs/operators';

import { deleteTemplate, retrieveTemplate } from '../../../axios/api';
import GridTable from '../../../components/GridTable/GridTable';
import Modal from '../../../components/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { TemplateFinding } from '../../../interface/report-finding';
import { useReportDataStore } from '../../../models/useStore';
import { isEmptyOrNil } from '../../../utils/general';
import classes from './RetrieveTemplateModal.module.scss';

const colDef: ColDef[] = [
    { field: 'Number', headerName: 'No.', width: 100 },
    {
        field: 'Content',
        headerName: 'Content',
        flex: 1,
        tooltipField: 'Content',
        tooltipComponent: 'multilineTooltip',
    },
    { field: 'DisplayIndex', headerName: 'DisplayIndex', flex: 1, hide: true },
];

interface Props {
    fieldId: string;
}

const RetrieveTemplateModal = ({ fieldId }: Props) => {
    const setModal = useContext(ModalContext);
    const { valueChanged, reportTemplate, formData } = useReportDataStore();
    const searchTextSubject$ = useRef(new Subject<string>());

    const [selectedItem, setSelectedItem] = useState<TemplateFinding>();
    const [hintVisible, setHintVisible] = useState<boolean>(false);
    const [searchText, setSearchText] = useState('');
    const [itemList, setItemList] = useState<TemplateFinding[]>([]);
    const [oriItemList, setOriItemList] = useState<TemplateFinding[]>([]);

    useEffect(() => {
        retrieveTemplate(reportTemplate, fieldId)
            .pipe(first())
            .subscribe((res) => {
                setItemList(res.data);
                setOriItemList(res.data);
            });
    }, [fieldId, reportTemplate]);

    useEffect(() => {
        setHintVisible(isEmptyOrNil(reportTemplate));
    }, [reportTemplate]);

    useEffect(() => {
        const subscription = searchTextSubject$.current
            .pipe(
                debounceTime(400),
                map((text) => text.toUpperCase()),
            )
            .subscribe((text) => {
                if (isEmptyOrNil(text)) {
                    setItemList(oriItemList);
                    return;
                }
                setItemList(
                    oriItemList.filter((item) => item.Content.toUpperCase().includes(text)),
                );
            });
        return () => subscription.unsubscribe();
    }, [itemList, oriItemList]);

    const onClose = () => {
        setModal(null);
    };

    const onInsert = () => {
        if (isEmptyOrNil(formData.get(fieldId))) {
            valueChanged(fieldId, `${selectedItem?.Content}`);
        } else {
            valueChanged(fieldId, `${formData.get(fieldId)}\r\n${selectedItem?.Content}`);
        }
        onClose();
    };

    const onSearch = (txt: string) => {
        setSearchText(txt);
        searchTextSubject$.current.next(txt);
    };

    const onDelete = () => {
        if (selectedItem === undefined) {
            return;
        }

        deleteTemplate(selectedItem.Number).subscribe((res: AxiosResponse) => {
            if (res.status === 200) {
                const newItemList = itemList.filter((item) => item.Number !== selectedItem.Number);
                setSearchText('');
                setItemList(newItemList);
                setOriItemList(newItemList);
            }
        });
    };

    const onSelectionChanged = (gridApi: GridApi) => {
        const selectedNodes = gridApi.getSelectedNodes();
        selectedNodes.forEach((node) => {
            setSelectedItem(node.data);
        });
    };

    const body = (
        <div className={classes.container}>
            <div className={classes.searchPanel}>
                <TextField
                    value={searchText}
                    onChange={(e) => onSearch(e.target.value)}
                    size="small"
                    label="Search"
                    variant="outlined"
                />
                {hintVisible ? (
                    <div className={classes.hint}>
                        <BiError className={classes.warnIcon} />
                        <span>ERS type did not select.</span>
                    </div>
                ) : null}
            </div>
            <div className={`${classes.grid} ag-theme-modal-black-header`}>
                <GridTable
                    rowData={itemList}
                    columnDefs={colDef}
                    rowSelection="single"
                    onSelectionChanged={onSelectionChanged}
                />
            </div>
        </div>
    );
    const footer = (
        <>
            <Button theme="primary" onClick={() => onInsert()}>
                Insert
            </Button>
            <Button theme="error" onClick={() => onDelete()}>
                Delete
            </Button>
            <Button theme="primary" onClick={() => onClose()}>
                Close
            </Button>
        </>
    );

    return (
        <Modal open width="80%" height="80%" headerTitle="Template" body={body} footer={footer} />
    );
};

export default RetrieveTemplateModal;
