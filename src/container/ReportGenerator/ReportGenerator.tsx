import React, { CSSProperties, useContext, useEffect, useState } from 'react';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Stack,
} from '@mui/material';
import { styled } from '@mui/styles';
import { observer } from 'mobx-react';
import * as R from 'ramda';
import { useRecoilState, useRecoilValue } from 'recoil';

import ReportDefineAttributeEditor from './container/ReportDefineAttributeEditor/ReportDefineAttributeEditor';
import ReportPage from './container/ReportPage/ReportPage';
import ReportPropertyPanel from './container/ReportPropertyPanel/ReportPropertyPanel';
import ReportGeneratorSection from './Layout/ReportGeneratorSection/ReportGeneratorSection';
import classes from './ReportGenerator.module.scss';
import { reportZoomState, selectedReportDefine } from '../../atom/report-generator';
import { fetchReportDefine, saveReportDefine } from '../../axios/api';
import Modal from '../../components/Modal/Modal';
import PdfCreator from '../../components/PdfCreator/PdfCreator';
import { ModalContext } from '../../context/modal-context';
import { FormDefineMap, Section } from '../../interface/define';
import { RepComponentAttribute } from '../../interface/report-generator/rep-attribute';
import { RepPage } from '../../interface/report-generator/rep-page';
import { useReportDataStore } from '../../models/useStore';
import { reportPage } from '../../styles/report/style';
import AddReportDefineModal from '../Modals/AddReportDefineModal/AddReportDefineModal';
import {
    ReportActionContext,
    ReportActionProvider,
} from '../Report/report-context/reportActionProvider';

const StyleSelect = styled(Select<string>)({
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& fieldset': {
        borderColor: 'white !important',
    },
});

const StyleRadio = styled(Radio)({
    '&.MuiRadio-root': {
        color: 'white',
    },
});

const ReportGenerator: React.FC = () => {
    const zoom = useRecoilValue(reportZoomState);
    const setModal = useContext(ModalContext);
    const { simulateReport } = useReportDataStore();

    const [reportTemplateMap, setReportTemplateMap] = useState<FormDefineMap>({});
    const [reportTemplateList, setReportTemplateList] = useState<string[]>([]);
    const [selectReportTemplate, setSelectReportTemplate] = useState('');

    const [activePage, setActivePage] = useState<string>('header');
    const [activeCompAttribute, setActiveCompAttribute] = useState<RepComponentAttribute>();

    // header & footer& define
    const [formDefine, setFormDefine] = useRecoilState(selectedReportDefine);
    const [formDefineType, setFormDefineType] = useState<'FormDefine' | 'PDFDefine'>('FormDefine');
    const [headerPage, setHeaderPage] = useState<RepPage>({
        name: 'header',
        width: 595,
        height: 200,
        components: {},
    });
    const [footerPage, setFooterPage] = useState<RepPage>({
        name: 'footer',
        width: 595,
        height: 200,
        components: {},
    });

    useEffect(() => {
        const subscription = fetchReportDefine().subscribe((res) => {
            const templateList = Object.entries(res.data).map(([, v]) => v);
            const defaultTemplate = templateList[0];
            setReportTemplateList(templateList.map((v) => v.ReportType));
            setReportTemplateMap(res.data);
            if (!defaultTemplate) return;
            setFormDefineType('FormDefine');
            setSelectReportTemplate(defaultTemplate.ReportType);
            setFormDefine(JSON.parse(defaultTemplate.FormDefine));
            setHeaderPage({
                width: 595 * zoom,
                height: 100 * zoom,
                ...JSON.parse(defaultTemplate.Header),
                name: 'header',
            });
            setFooterPage({
                width: 595 * zoom,
                height: 100 * zoom,
                ...JSON.parse(defaultTemplate.Footer),
                name: 'footer',
            });
            simulateReport();
        });
        return () => subscription.unsubscribe();
    }, [simulateReport, setFormDefine, zoom]);

    // 切換報告格式
    const switchReportTemplate = (template: string) => {
        const selectedTemplate = reportTemplateMap[template];
        setSelectReportTemplate(selectedTemplate.ReportType);
        setFormDefine(JSON.parse(selectedTemplate[formDefineType]));
        setHeaderPage({ ...JSON.parse(selectedTemplate.Header), name: 'header' });
        setFooterPage({ ...JSON.parse(selectedTemplate.Footer), name: 'footer' });
    };

    // 切換報告是Report還是PDF
    const switchReportTemplateType = (type: 'FormDefine' | 'PDFDefine') => {
        const selectedTemplate = reportTemplateMap[selectReportTemplate];
        setFormDefineType(type);
        setFormDefine(JSON.parse(selectedTemplate[type]));
        setHeaderPage(JSON.parse(selectedTemplate.Header));
        setFooterPage(JSON.parse(selectedTemplate.Footer));
    };

    // 儲存報告
    const onSaveReportDefine = () => {
        const data = {
            ...reportTemplateMap[selectReportTemplate],
            Header: JSON.stringify(headerPage),
            Footer: JSON.stringify(footerPage),
        };

        if (formDefineType === 'FormDefine') data.FormDefine = JSON.stringify(formDefine);
        else data.PDFDefine = JSON.stringify(formDefine);

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
        fetchReportDefine().subscribe((res) => {
            const templateList = Object.entries(res.data).map(([, v]) => v);
            setReportTemplateList(templateList.map((v) => v.ReportType));
            setReportTemplateMap(res.data);
        });
        setModal(<AddReportDefineModal onAddReportDefine={() => {}} />);
    };

    const onSetActiveCompAttribute = (uuid: string) => {
        if (activePage === 'header') {
            setActiveCompAttribute(R.path(['components', uuid], headerPage));
        } else if (activePage === 'footer') {
            setActiveCompAttribute(R.path(['components', uuid], footerPage));
        }
    };

    const onSetCompAttribute = (
        uuid: string,
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => {
        if (!activeCompAttribute) return;
        const setValue = (pre) => {
            const newValue = R.assocPath(['components', uuid, attrPath], attrValue, pre);
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
            return R.assocPath([attrPath], attrValue, pre);
        };
        if (pageName === 'header') setHeaderPage(setValue);
        else if (pageName === 'footer') setFooterPage(setValue);
    };

    const onCompValueChanged = (uuid: string, value: string) => {
        if (!uuid) return;
        onSetCompAttribute(uuid, ['value'], value);
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
                        pdfDefine={formDefine}
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
                    <IconButton onClick={addNewReportTemplateDefine}>
                        <AddCircleIcon sx={{ color: 'white !important' }} />
                    </IconButton>
                    <FormControl sx={{ m: 1, minWidth: 200, color: 'white' }} color={undefined}>
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
                    <RadioGroup
                        row
                        value={formDefineType}
                        onChange={(event) => switchReportTemplateType(event.target.value as any)}
                    >
                        <FormControlLabel
                            sx={{ color: 'white' }}
                            value="FormDefine"
                            control={<StyleRadio />}
                            label="Report"
                        />
                        <FormControlLabel
                            sx={{ color: 'white' }}
                            value="PDFDefine"
                            control={<StyleRadio />}
                            label="PDF"
                        />
                    </RadioGroup>
                    <Button variant="contained" color="warning" onClick={onPreviewPdf}>
                        Preview Report
                    </Button>
                    <Button variant="contained" color="success" onClick={onSaveReportDefine}>
                        Save Report Define
                    </Button>
                </Stack>
                <div className={classes.reportContainer}>
                    <ReportDefineAttributeEditor />
                    <div className={classes.reportLayout}>
                        <Box sx={reportPage}>
                            {/* Header */}
                            <ReportPage
                                page={headerPage}
                                setPage={setHeaderPage}
                                setPageActive={setActivePage}
                                setActiveCompAttribute={onSetActiveCompAttribute}
                                onCompValueChanged={onCompValueChanged}
                            />
                            {/* Content */}
                            {formDefine.sections.map((section: Section, idx: number) => (
                                <ReportGeneratorSection
                                    key={section.id}
                                    path={['sections', idx]}
                                    section={section}
                                    actionContext={ReportActionContext}
                                />
                            ))}
                            {/* Footer */}
                            <ReportPage
                                page={footerPage}
                                setPage={setFooterPage}
                                setPageActive={setActivePage}
                                setActiveCompAttribute={onSetActiveCompAttribute}
                                onCompValueChanged={onCompValueChanged}
                            />
                        </Box>
                    </div>
                    <ReportPropertyPanel
                        headerPage={headerPage}
                        footerPage={footerPage}
                        compAttribute={activeCompAttribute}
                        onSetCompAttribute={onSetCompAttribute}
                        onSetPageAttribute={onSetPageAttribute}
                    />
                </div>
            </ReportActionProvider>
        </>
    );
};

export default observer(ReportGenerator);
