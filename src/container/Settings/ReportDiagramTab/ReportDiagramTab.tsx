import * as React from 'react';
import { useEffect, useState } from 'react';

import { Cancel } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Box, IconButton, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { observer } from 'mobx-react';
import { concatMap } from 'rxjs/operators';

import classes from './ReportDiagramTab.module.scss';
import { deleteDiagram, fetchDiagram, saveDiagram } from '../../../axios/api';
import { Diagram } from '../../../interface/diagram';
import { useOptionStore } from '../../../models/useStore';

const ReportDiagramTab = () => {
    const { codeListMap } = useOptionStore();
    const [selectReportTemplate, setSelectReportTemplate] = useState<string>('');
    const [diagramList, setDiagramList] = useState<Diagram[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const onFetchReportDiagram = (reportTemplate: string) => {
        setSelectReportTemplate(reportTemplate);
        fetchDiagram(reportTemplate).subscribe((res) => {
            setDiagramList(res.data);
        });
    };

    const onSaveDiagram = (file: File) => {
        const formData = new FormData();
        formData.append('File', file);
        saveDiagram(selectReportTemplate, formData)
            .pipe(concatMap(() => fetchDiagram(selectReportTemplate)))
            .subscribe((res) => {
                setDiagramList(res.data);
            });
    };

    const onDeleteDiagram = (number: number) => {
        deleteDiagram(selectReportTemplate, number)
            .pipe(concatMap(() => fetchDiagram(selectReportTemplate)))
            .subscribe((res) => {
                setDiagramList(res.data);
            });
    };

    useEffect(() => {
        if (codeListMap?.get('ReportTemplate')?.[0]) {
            onFetchReportDiagram(codeListMap?.get('ReportTemplate')[0].Label);
        }
    }, [codeListMap]);

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
                        <div>Report Template</div>
                    </ListSubheader>
                }
            >
                {codeListMap?.get('ReportTemplate')?.map((option) => {
                    return (
                        <ListItemButton
                            key={option.Label}
                            selected={option.Label === selectReportTemplate}
                            onClick={() => {
                                onFetchReportDiagram(option.Label);
                            }}
                        >
                            <ListItemText primary={option.Label} />
                        </ListItemButton>
                    );
                })}
            </List>

            <div className={classes.gridRowContainer}>
                {diagramList.map((diagram) => {
                    return (
                        <Card key={diagram.Number} className={classes.gridItem}>
                            <Box sx={{ alignSelf: 'flex-end' }}>
                                <IconButton onClick={() => onDeleteDiagram(diagram.Number)}>
                                    <Cancel />
                                </IconButton>
                            </Box>
                            <CardContent sx={{ display: 'flex', width: '100%', height: '100%' }}>
                                <img src={diagram.DiagramUrl} alt="None" />
                            </CardContent>
                        </Card>
                    );
                })}
                <Card className={classes.gridItem}>
                    <div className={classes.addItem} onClick={() => fileInputRef?.current?.click()}>
                        <AddIcon color="primary" sx={{ fontSize: '64px' }} />
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        accept={'image/*'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!e.target.files) return;
                            onSaveDiagram(e.target.files[0]);
                        }}
                    />
                </Card>
            </div>
        </Stack>
    );
};

export default observer(ReportDiagramTab);
