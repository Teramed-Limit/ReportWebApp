import * as React from 'react';

import { Box, Stack, Tab, Tabs } from '@mui/material';

import TabPanel from '../../components/TabPanel/TabPanel';
import CodeListTab from './CodeListTab/CodeListTab';
import ReportDiagramTab from './ReportDiagramTab/ReportDiagramTab';
import SignatureTab from './SignatureTab/SignatureTab';

const Settings = () => {
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
                    <Tab label="Signature" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <CodeListTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ReportDiagramTab />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <SignatureTab />
            </TabPanel>
        </Stack>
    );
};

export default Settings;
