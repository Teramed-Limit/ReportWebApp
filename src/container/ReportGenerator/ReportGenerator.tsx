import React, { CSSProperties, useCallback, useContext, useEffect, useState } from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Tooltip,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/styles';
import { AxiosResponse } from 'axios';
import { observer } from 'mobx-react';
import * as R from 'ramda';
import { useRecoilState, useRecoilValue } from 'recoil';
import { concatMap } from 'rxjs/operators';

import ReportPropertyPanel from './ReportComponent/Layout/ReportPropertyPanel/ReportPropertyPanel';
import ReportPage from './ReportComponent/Page/ReportPage';
import ImageDefineAttributeEditor from './ReportDefine/Attribute/ImageDefineAttributeEditor/ImageDefineAttributeEditor';
import ReportDefineAttributeEditor from './ReportDefine/Attribute/ReportDefineAttributeEditor/ReportDefineAttributeEditor';
import UniversalFontStyle from './ReportDefine/Component/UniversalFontStyle/UniversalFontStyle';
import ReportGeneratorImagePage from './ReportDefine/Layout/ReportGeneratorImagePage/ReportGeneratorImagePage';
import ReportGeneratorPage from './ReportDefine/Layout/ReportGeneratorPage/ReportGeneratorPage';
import classes from './ReportGenerator.module.scss';
import {
    selectedDefineType,
    selectedReportDefine,
    selectedReportImageDefine,
} from '../../atom/report-generator';
import {
    addReportDefine,
    copyFromOtherReportDefine,
    deleteReportDefine,
    fetchReportDefine,
    saveReportDefine,
} from '../../axios/api';
import Modal from '../../components/Modal/Modal';
import PdfCreator from '../../components/PdfCreator/PdfCreator';
import { ModalContext } from '../../context/modal-context';
import { FormDefineDto, FormDefineMap } from '../../interface/define';
import { RepComponentAttribute } from '../../interface/report-generator/rep-attribute';
import { RepPage } from '../../interface/report-generator/rep-page';
import { initRepPage } from '../../logic/report-define/report-define-service';
import { useReportDataStore } from '../../models/useStore';
import { reportPage } from '../../styles/report/style';
import AddReportDefineModal from '../Modals/AddReportDefineModal/AddReportDefineModal';
import MessageModal from '../Modals/MessageModal/MessageModal';
import { ReportActionProvider } from '../Report/Context/reportActionProvider';

const StyleSelect = styled(Select<string>)({
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& fieldset': {
        borderColor: 'white !important',
    },
});

const ReportGenerator: React.FC = () => {
    const setModal = useContext(ModalContext);
    const { simulateReport } = useReportDataStore();

    const [reportTemplateMap, setReportTemplateMap] = useState<FormDefineMap>({});
    const [reportTemplateList, setReportTemplateList] = useState<string[]>([]);
    const [selectReportTemplate, setSelectReportTemplate] = useState('');

    const [activePage, setActivePage] = useState<string>('header');
    const [activeCompAttribute, setActiveCompAttribute] = useState<RepComponentAttribute>();

    // header & footer& define
    const defineType = useRecoilValue(selectedDefineType);
    const [formDefine, setFormDefine] = useRecoilState(selectedReportDefine);
    const [imageDefine, setImageDefine] = useRecoilState(selectedReportImageDefine);
    const [headerPage, setHeaderPage] = useState<RepPage>(initRepPage('header'));
    const [footerPage, setFooterPage] = useState<RepPage>(initRepPage('footer'));
    const [showGuideLine, onToggleGuideline] = useState<boolean>(true);

    const loadDefaultTemplate = useCallback(
        (defaultTemplate: FormDefineDto) => {
            if (!defaultTemplate) return;
            setSelectReportTemplate(defaultTemplate.ReportType);
            setFormDefine(JSON.parse(defaultTemplate.FormDefine));
            setImageDefine(JSON.parse(defaultTemplate.ImageDefine));
            setHeaderPage({
                ...initRepPage('header'),
                ...JSON.parse(defaultTemplate.Header),
            });
            setFooterPage({
                ...initRepPage('footer'),
                ...JSON.parse(defaultTemplate.Footer),
            });
            simulateReport();
        },
        [setFormDefine, setImageDefine, simulateReport],
    );

    const updateReportTemplateData = useCallback(
        ({ data: defineMap }: AxiosResponse<FormDefineMap>, template?: string) => {
            const templateList = Object.entries(defineMap).map(([, v]) => v);
            const defaultTemplate = template ? defineMap[template] : templateList[0];

            setReportTemplateList(templateList.map((v) => v.ReportType));
            setReportTemplateMap(defineMap);

            if (defaultTemplate) {
                loadDefaultTemplate(defaultTemplate);
            }
        },
        [loadDefaultTemplate],
    );

    useEffect(() => {
        const subscription = fetchReportDefine().subscribe(updateReportTemplateData);
        return () => subscription.unsubscribe();
    }, [updateReportTemplateData]);

    // 切換報告格式
    const switchReportTemplate = (template: string) => {
        const selectedTemplate = reportTemplateMap[template];
        loadDefaultTemplate(selectedTemplate);
    };

    // 儲存報告
    const onSaveReportDefine = () => {
        const data = {
            ...reportTemplateMap[selectReportTemplate],
            Header: JSON.stringify(headerPage),
            Footer: JSON.stringify(footerPage),
            FormDefine: JSON.stringify(formDefine),
            ImageDefine: JSON.stringify(imageDefine),
        };

        saveReportDefine(data).subscribe({
            next: () => {
                setReportTemplateMap((prevState) => ({
                    ...prevState,
                    [selectReportTemplate]: data,
                }));
            },
            error: () => {},
        });
    };

    // 新增報告格式
    const addNewReportTemplateDefine = () => {
        setModal(
            <AddReportDefineModal
                onAddReportDefine={(value) => {
                    addReportDefine(value)
                        .pipe(concatMap(fetchReportDefine))
                        .subscribe((res) => updateReportTemplateData(res, value));
                }}
            />,
        );
    };

    // 複製報告格式
    const copyReportTemplateDefine = () => {
        setModal(
            <AddReportDefineModal
                onAddReportDefine={(value) => {
                    copyFromOtherReportDefine(selectReportTemplate, value)
                        .pipe(concatMap(fetchReportDefine))
                        .subscribe((res) => updateReportTemplateData(res, value));
                }}
            />,
        );
    };

    const deleteReportTemplateDefine = () => {
        setModal(
            <MessageModal
                headerTitle="Delete Report Template"
                bodyContent="Are you sure to delete this report template?"
                onConfirmCallback={() => {
                    deleteReportDefine(selectReportTemplate)
                        .pipe(concatMap(fetchReportDefine))
                        .subscribe(updateReportTemplateData);
                }}
            />,
        );
    };

    const onSetActiveCompAttribute = (uuid: string) => {
        if (activePage === 'header') {
            setActiveCompAttribute(
                R.path(['components', uuid], headerPage) as RepComponentAttribute,
            );
        } else if (activePage === 'footer') {
            setActiveCompAttribute(
                R.path(['components', uuid], footerPage) as RepComponentAttribute,
            );
        }
    };

    const onSetCompAttribute = (
        uuid: string,
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => {
        if (!activeCompAttribute) return;
        const setValue = (pre) => {
            const newValue = R.assocPath(['components', uuid, ...attrPath], attrValue, pre);
            setActiveCompAttribute(R.path(['components', uuid], newValue));
            return newValue;
        };
        if (activePage === 'header') setHeaderPage(setValue);
        else if (activePage === 'footer') setFooterPage(setValue);
    };

    const onSetPageAttribute = (
        pageName: string,
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => {
        const setValue = (pre) => {
            return R.assocPath(attrPath, attrValue, pre);
        };
        if (pageName === 'header') setHeaderPage(setValue);
        else if (pageName === 'footer') setFooterPage(setValue);
    };

    const onCompValueChanged = (uuid: string, attrPath: (string | number)[], value: string) => {
        if (!uuid) return;
        onSetCompAttribute(uuid, attrPath, value);
    };

    const onPreviewPdf = () => {
        setModal(
            <Modal
                open
                width="80%"
                height="80%"
                overflow="hidden hidden"
                headerTitle="PDF Preview"
                body={
                    <PdfCreator
                        headerDefine={headerPage}
                        formDefine={formDefine}
                        imageDefine={imageDefine}
                        footerDefine={footerPage}
                        showToolbar
                    />
                }
                bodyCSS={{ padding: '0' } as CSSProperties}
                footer={
                    <Button variant="contained" color="success" onClick={() => setModal(null)}>
                        Close
                    </Button>
                }
            />,
        );
    };

    return (
        <>
            <ReportActionProvider>
                <Stack spacing={1} direction="row" className={classes.header}>
                    <Tooltip title="New Report Template">
                        <IconButton onClick={addNewReportTemplateDefine}>
                            <AddCircleIcon sx={{ color: 'white !important' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy Current Report Template">
                        <IconButton onClick={copyReportTemplateDefine}>
                            <FileCopyIcon sx={{ color: 'white !important' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Current Report Template">
                        <IconButton onClick={deleteReportTemplateDefine}>
                            <DeleteIcon sx={{ color: 'white !important' }} />
                        </IconButton>
                    </Tooltip>
                    <FormControl sx={{ m: 1, minWidth: 150, color: 'white' }} color={undefined}>
                        <InputLabel sx={{ color: 'white !important' }}>Report Template</InputLabel>
                        <StyleSelect
                            autoWidth
                            label="Report Template"
                            value={selectReportTemplate}
                            size="small"
                            onChange={(event: SelectChangeEvent) =>
                                switchReportTemplate(event.target.value)
                            }
                        >
                            {reportTemplateList.map((name) => (
                                <MenuItem key={name} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </StyleSelect>
                    </FormControl>
                    <Button
                        startIcon={<PreviewIcon />}
                        variant="contained"
                        color="warning"
                        onClick={onPreviewPdf}
                    >
                        Preview Report
                    </Button>
                    <Button
                        startIcon={<SaveIcon />}
                        variant="contained"
                        color="success"
                        onClick={onSaveReportDefine}
                    >
                        Save Report Define
                    </Button>
                </Stack>
                <Box className={classes.reportContainer}>
                    {/* Attribute Editor */}
                    {defineType === 'FormDefine' ? (
                        <ReportDefineAttributeEditor />
                    ) : (
                        <ImageDefineAttributeEditor />
                    )}
                    <Stack direction="column" spacing="4px">
                        {/* Global Attribute Editor */}
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    color={'secondary'}
                                    checked={showGuideLine}
                                    onChange={(event) => onToggleGuideline(event.target.checked)}
                                />
                            }
                            label="Show Guide Line"
                        />
                        <Stack className={classes.sticky} direction="row" spacing="20px">
                            <UniversalFontStyle
                                title="Universal Label Style"
                                styleKey="labelStyle"
                            />
                            <UniversalFontStyle
                                title="Universal Value Style"
                                styleKey="valueStyle"
                            />
                        </Stack>
                        {/* Report */}
                        <Box className={classes.reportLayout} sx={reportPage}>
                            <Box className={classes.page}>
                                {/* Header */}
                                <ReportPage
                                    page={headerPage}
                                    setPage={setHeaderPage}
                                    setPageActive={setActivePage}
                                    setActiveCompAttribute={onSetActiveCompAttribute}
                                    onCompValueChanged={onCompValueChanged}
                                />
                                {/* Content */}
                                <ReportGeneratorPage
                                    showGuideLine={showGuideLine}
                                    sections={formDefine.sections}
                                />
                                {/* Footer */}
                                <ReportPage
                                    page={footerPage}
                                    setPage={setFooterPage}
                                    setPageActive={setActivePage}
                                    setActiveCompAttribute={onSetActiveCompAttribute}
                                    onCompValueChanged={onCompValueChanged}
                                />
                                {/* Image */}
                                <ReportGeneratorImagePage
                                    showGuideLine={showGuideLine}
                                    fields={imageDefine}
                                />
                            </Box>
                        </Box>
                    </Stack>
                    <ReportPropertyPanel
                        headerPage={headerPage}
                        footerPage={footerPage}
                        compAttribute={activeCompAttribute}
                        onSetCompAttribute={onSetCompAttribute}
                        onSetPageAttribute={onSetPageAttribute}
                    />
                </Box>
            </ReportActionProvider>
        </>
    );
};

export default observer(ReportGenerator);
