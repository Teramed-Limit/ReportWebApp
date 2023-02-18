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
import { useRecoilState } from 'recoil';

import { selectedReportDefine } from '../../atom/report-generator';
import { fetchReportDefine } from '../../axios/api';
import Modal from '../../components/Modal/Modal';
import PdfCreator from '../../components/PdfCreator/PdfCreator';
import { ModalContext } from '../../context/modal-context';
import { useParentModalMove } from '../../hooks/useModalMove/useParentModalMove';
import { FormDefineMap, Section } from '../../interface/define';
import { RepComponent, RepPage } from '../../interface/rep-report';
import { useReportDataStore } from '../../models/useStore';
import { reportPage } from '../../styles/report/style';
import AddReportDefineModal from '../Modals/AddReportDefineModal/AddReportDefineModal';
import {
    ReportActionContext,
    ReportActionProvider,
} from '../Report/report-context/reportActionProvider';
import ReportComponentSelector from './container/ReportComponentSelector/ReportComponentSelector';
import ReportDefineAttributeEditor from './container/ReportDefineAttributeEditor/ReportDefineAttributeEditor';
import ReportPage from './container/ReportPage/ReportPage';
import ReportGeneratorSection from './Layout/ReportGeneratorSection/ReportGeneratorSection';
import classes from './ReportGenerator.module.scss';

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
    const setModal = useContext(ModalContext);
    const [reportTemplateMap, setReportTemplateMap] = useState<FormDefineMap>({});
    const [reportTemplateList, setReportTemplateList] = useState<string[]>([]);
    const [selectReportTemplate, setSelectReportTemplate] = useState('');

    // header & footer
    const [headerPage, setHeaderPage] = useState<RepPage>({
        name: 'header',
        height: 200,
        components: {},
    });
    const [footerPage, setFooterPage] = useState<RepPage>({
        name: 'footer',
        height: 200,
        components: {},
    });
    const [activePage, setActivePage] = useState<string>('header');
    const [attribute, setAttribute] = useState<RepComponent>();

    const { simulateReport } = useReportDataStore();
    const [formDefine, setFormDefine] = useRecoilState(selectedReportDefine);
    const [formDefineType, setFormDefineType] = useState<string>('');

    // movable windows
    const { onRegisterMoveModalId, onModalReadyToMove, onMouseMove, onMouseUp } =
        useParentModalMove();

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
            setHeaderPage(JSON.parse(defaultTemplate.Header));
            setFooterPage(JSON.parse(defaultTemplate.Footer));
            simulateReport();
        });
        return () => subscription.unsubscribe();
    }, [simulateReport, setFormDefine]);

    const switchReportTemplate = (template: string) => {
        const selectedTemplate = reportTemplateMap[template];
        setSelectReportTemplate(selectedTemplate.ReportType);
        setFormDefine(JSON.parse(selectedTemplate[formDefineType]));
    };

    const switchReportTemplateType = (type: string) => {
        const selectedTemplate = reportTemplateMap[selectReportTemplate];
        setFormDefineType(type);
        setFormDefine(JSON.parse(selectedTemplate[type]));
    };

    const addNewReportTemplateDefine = () => {
        fetchReportDefine().subscribe((res) => {
            const templateList = Object.entries(res.data).map(([, v]) => v);
            setReportTemplateList(templateList.map((v) => v.ReportType));
            setReportTemplateMap(res.data);
        });
        setModal(<AddReportDefineModal onAddReportDefine={() => {}} />);
    };

    const onSetPageAttribute = (
        uuid: string,
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => {
        if (!attribute) return;

        const setValue = (pre) => {
            const newValue = R.assocPath(['components', uuid, attrPath], attrValue, pre);
            setAttribute(R.path(['components', uuid], newValue));
            return newValue;
        };

        if (activePage === 'header') setHeaderPage(setValue);
        else if (activePage === 'footer') setFooterPage(setValue);
    };

    const onSetActiveCompAttribute = (uuid: string) => {
        if (!uuid) return;
        if (activePage === 'header') setAttribute(R.path(['components', uuid], headerPage));
        else if (activePage === 'footer') setAttribute(R.path(['components', uuid], footerPage));
    };

    const onCompValueChanged = (uuid: string, value: string) => {
        if (!uuid) return;
        onSetPageAttribute(uuid, ['value'], value);
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
                        onChange={(event) => switchReportTemplateType(event.target.value)}
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
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => {
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
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => setModal(null)}
                                        >
                                            Close
                                        </Button>
                                    }
                                />,
                            );
                        }}
                    >
                        Preview Report
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            console.log(formDefine);
                            console.log(headerPage);
                        }}
                    >
                        Save Report Define
                    </Button>
                </Stack>
                <div
                    className={classes.reportContainer}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                >
                    <ReportDefineAttributeEditor
                        id="modal1"
                        ref={(ref) => onRegisterMoveModalId('modal1', ref)}
                        onModalReadyToMove={onModalReadyToMove}
                    />
                    <ReportComponentSelector
                        id="modal2"
                        ref={(ref) => onRegisterMoveModalId('modal2', ref)}
                        attribute={attribute}
                        onModalReadyToMove={onModalReadyToMove}
                        onSetAttribute={onSetPageAttribute}
                    />
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
                </div>
            </ReportActionProvider>
        </>
    );
};

export default observer(ReportGenerator);
