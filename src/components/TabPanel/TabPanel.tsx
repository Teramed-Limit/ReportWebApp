import React from 'react';

import { Stack } from '@mui/material';

interface Props {
    children?: React.ReactNode;
    index: number;
    value: number;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
}

function TabPanel({ children, value, direction = 'column', index }: Props) {
    return (
        <Stack
            spacing={1}
            p={1}
            direction={direction}
            sx={{
                flex: '1 1 auto',
                overflow: 'auto',
                width: '100%',
                height: '100%',
                display: value !== index ? 'none' : 'flex',
            }}
        >
            {value === index ? children : null}
        </Stack>
    );
}

export default TabPanel;
