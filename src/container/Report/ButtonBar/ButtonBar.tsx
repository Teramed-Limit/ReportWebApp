import React, { useContext } from 'react';

import { Stack } from '@mui/material';

import Button from '../../../components/UI/Button/Button';
import { NotificationContext } from '../../../context/notification-context';
import { BaseActionParams } from '../../../interface/action';
import { Field } from '../../../interface/report-field/field';
import { fieldButtonBar } from '../../../styles/report/style';

interface Props {
    field: Field;
    formData: any;
    modifiable: boolean;
    actionContext: React.Context<{ [p: string]: (actionParams: any) => void }>;
}

const ButtonBar = ({ field, formData, modifiable, actionContext }: Props) => {
    const actionDispatcher = useContext(actionContext);
    const { openNotification } = useContext(NotificationContext);

    const executeAction = (action: string, actionParams: BaseActionParams) => {
        if (!actionDispatcher[action]) {
            console.error('Action not defined');
            return;
        }

        actionDispatcher[action]({
            ...actionParams,
            formData: formData.toJSON(),
            field,
            openNotification,
        });
    };

    return (
        <>
            {field.buttonBar && (
                <Stack direction="row" sx={fieldButtonBar} spacing="2px">
                    {field.buttonBar
                        .filter((buttonMeta) => !buttonMeta.hide)
                        .map((buttonMeta) => (
                            <Button
                                key={buttonMeta.id}
                                theme="primary"
                                disabled={buttonMeta?.disable && !modifiable}
                                onClick={() =>
                                    executeAction(buttonMeta.action, {
                                        ...buttonMeta.actionParams,
                                        field,
                                    })
                                }
                            >
                                {buttonMeta.label}
                            </Button>
                        ))}
                </Stack>
            )}
        </>
    );
};

export default ButtonBar;
