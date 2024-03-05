import React from 'react';

import { Box, Stack, Tab, Tabs } from '@mui/material';
import { observer } from 'mobx-react';

import TabPanel from '../../components/TabPanel/TabPanel';
import { useReportDataStore } from '../../models/useStore';
import CodeListTab from '../Settings/CodeListTab/CodeListTab';
import ReportDiagramTab from '../Settings/ReportDiagramTab/ReportDiagramTab';

const Attachment = () => {
    const { attachmentData } = useReportDataStore();

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Stack sx={{ width: '100%', height: '100%', p: 1, overflow: 'hidden' }} direction="column">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Options" />
                    <Tab label="Diagram" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <CodeListTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ReportDiagramTab />
            </TabPanel>
        </Stack>
    );
};

export default observer(Attachment);
