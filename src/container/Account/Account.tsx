import React from 'react';

import { Stack, Tab, Tabs } from '@mui/material';

import UserAccount from './UserAccount/UserAccount';
import UserRoles from './UserRoles/UserRoles';
import TabPanel from '../../components/TabPanel/TabPanel';
import FieldFilterRuleComp from '../Settings/FieldFilterRule/FieldFilterRule';
import UserGroup from '../UserGroup/UserGroup';

const Account = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Stack sx={{ width: '100%', height: '100%', p: 1, overflow: 'hidden' }} direction="column">
            <Stack sx={{ borderBottom: 1, borderColor: 'divider', flex: '0 0 auto' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Account" />
                    <Tab label="User Group" />
                    <Tab label="Filter Rule" />
                </Tabs>
            </Stack>
            <TabPanel value={value} index={0}>
                <UserAccount />
                <UserRoles />
            </TabPanel>
            <TabPanel value={value} direction="row" index={1}>
                <UserGroup />
            </TabPanel>
            <TabPanel value={value} direction="row" index={2}>
                <FieldFilterRuleComp />
            </TabPanel>
        </Stack>
    );
};

export default Account;
