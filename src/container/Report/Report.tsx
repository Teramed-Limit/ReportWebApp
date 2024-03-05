import React, { useContext, useEffect, useState } from 'react';

import { Box, Drawer, Stack } from '@mui/material';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { Prompt, useParams } from 'react-router-dom';

import ReportEditActionBar from './ActionBar/ReportEditActionBar/ReportEditActionBar';
import ReportViewActionBar from './ActionBar/ReportViewActionBar/ReportViewActionBar';
import { ReportActionContext, ReportActionProvider } from './Context/reportActionProvider';
import ReportSection from './Layout/ReportSection/ReportSection';
import classes from './Report.module.scss';
import Icon from '../../components/UI/Icon/Icon';
import { NotificationContext } from '../../context/notification-context';
import { useModal } from '../../hooks/useModal';
import { Section } from '../../interface/define';
import {
    useOptionStore,
    useReportDataStore,
    useReportDefineStore,
    useReportImageStore,
} from '../../models/useStore';
import { reportPage } from '../../styles/report/style';
import Photo from '../Photo/Photo';

const Report = () => {
    const { showNotifyMsg } = useContext(NotificationContext);
    const { studyInstanceUID } = useParams<any>();
    const { formDefine } = useReportDefineStore();
    const {
        fetchReport,
        reportHasChanged,
        modifiable,
        formValidation,
        unlockReport,
        saveTempReportData,
    } = useReportDataStore();
    const { loading: fetchDefineLoading } = useReportDefineStore();
    const { loading: fetchOptionsLoading } = useOptionStore();
    const { exportDiagramUrl } = useReportImageStore();
    const [setModalName] = useModal();

    const [photoDrawerOpen, setPhotoDrawerOpen] = useState(false);
    const toggleImageDrawer = () => {
        setPhotoDrawerOpen((pre) => {
            // 關閉時記錄Report Diagram
            if (pre) exportDiagramUrl();
            return !pre;
        });
    };

    // 若有藏在Modal的錯誤訊息，則打開Modal
    useEffect(() => {
        if (!formValidation.isValid) setModalName(formValidation.openModalName);
    }, [formValidation, setModalName]);

    // 進來時先檢查是否有鎖定
    useEffect(() => {
        // wait ready
        if (fetchOptionsLoading || fetchDefineLoading) return;
        fetchReport(studyInstanceUID)
            .then((notify) => {
                showNotifyMsg(notify);
            })
            .catch((error) => {
                // 處理錯誤的情況
                console.error('Error occurs:', error.message);
            });
    }, [fetchReport, fetchDefineLoading, fetchOptionsLoading, studyInstanceUID, showNotifyMsg]);

    // 離開時解鎖
    useEffect(() => {
        // 直接頁面事件觸發
        const handleBeforeUnload = (event) => {
            // 在用戶嘗試離開頁面時觸發
            event.preventDefault(); // 防止預設的處理方式（例如表單的自動提交）
            event.returnValue = ''; // 顯示給用戶的確認訊息
            saveTempReportData();
            // 不能控制離開頁面時，使用者按下"取消"/"確定"，所以暫時不清理狀態
            // 反正關閉頁面時，所有狀態都不會保留
            unlockReport(studyInstanceUID, false);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            saveTempReportData();
            // 這是做給離開頁面時的事件處理，會被react-router-dom觸發，但是關閉直接頁面不會觸發
            unlockReport(studyInstanceUID, true);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [saveTempReportData, studyInstanceUID, unlockReport]);

    return (
        <>
            <Prompt
                when={reportHasChanged}
                message="The report was not saved, are you sure to leave?"
            />
            <ReportActionProvider>
                <div className={classes.header}>
                    <Stack direction="row" spacing={2}>
                        {modifiable ? <ReportEditActionBar /> : <ReportViewActionBar />}
                    </Stack>
                </div>
                <Stack direction="row">
                    <Box className={classes.reportLayout} sx={reportPage}>
                        <Box className={classes.page}>
                            {formDefine.sections
                                .filter((section: Section) => !section.hide)
                                .map((section: Section) => (
                                    <ReportSection
                                        key={section.id}
                                        section={section}
                                        actionContext={ReportActionContext}
                                    />
                                ))}
                        </Box>
                    </Box>
                    {/*<Box flex="0 0 300px" sx={{ minWidth: '500px', border: '1px red solid' }}>*/}
                    {/*    <Attachment />*/}
                    {/*</Box>*/}
                </Stack>
            </ReportActionProvider>
            {/* Photo Drawer */}
            <button
                style={{ top: '245px' }}
                className={cx(classes.drawerBtn)}
                type="button"
                onClick={toggleImageDrawer}
            >
                <Icon type="photos" size={40} />
            </button>
            <Drawer
                disableEnforceFocus
                PaperProps={{ sx: { width: '90%' } }}
                ModalProps={{ keepMounted: true }}
                anchor="left"
                open={photoDrawerOpen}
                onClose={toggleImageDrawer}
            >
                <Photo />
            </Drawer>
            {/* Attachment Drawer */}
            {/*<button*/}
            {/*    style={{ top: '335px' }}*/}
            {/*    className={cx(classes.drawerBtn)}*/}
            {/*    type="button"*/}
            {/*    onClick={toggleImageDrawer}*/}
            {/*>*/}
            {/*    <Icon type="photos" size={40} />*/}
            {/*</button>*/}
        </>
    );
};

export default observer(Report);
