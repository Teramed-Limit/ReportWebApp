import React, { useCallback } from 'react';

import { Button, Stack } from '@mui/material';
import * as R from 'ramda';

import { ButtonBarAttribute } from './ButtonBarAttribute';

interface Props {
    attrPath: (string | number)[];
    attribute: ButtonBarAttribute[];
    setAttribute: (attrName: (string | number)[], attrValue: any) => void;
}

const ReportButtonBarAttribute = ({ attrPath, attribute, setAttribute }: Props) => {
    const addButtonBarAttribute = useCallback(
        (newAttr) => {
            if (attribute?.find((attr) => attr.id === newAttr.id)) return;
            setAttribute(['buttonBar'], [...(attribute || []), newAttr]);
        },
        [attribute, setAttribute],
    );

    const deleteButtonBar = useCallback(() => {
        if (!attribute || attribute?.length === 0) return;
        const newButtonBar = R.remove(attribute.length - 1, attribute.length, attribute);
        setAttribute(['buttonBar'], newButtonBar);
    }, [attribute, setAttribute]);

    return (
        <Stack sx={{ margin: '2px' }} spacing="2px">
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                    addButtonBarAttribute({
                        id: 'createTemplate',
                        label: 'Create Template',
                        action: 'createTemplate',
                    })
                }
            >
                Add Create Template
            </Button>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                    addButtonBarAttribute({
                        id: 'retrieveTemplate',
                        label: 'Retrieve Template',
                        action: 'openModal',
                        actionParams: { modalName: 'retrieveTemplate' },
                    })
                }
            >
                Add Retrieve Template
            </Button>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                    addButtonBarAttribute({
                        id: 'fillInDetails',
                        label: 'Fill in details',
                        action: 'openModal',
                        actionParams: { modalName: 'fillInDetails' },
                    })
                }
            >
                Add Fill In Details
            </Button>
            <Button variant="contained" color="error" fullWidth onClick={deleteButtonBar}>
                Delete
            </Button>
        </Stack>
    );
};

export default ReportButtonBarAttribute;
