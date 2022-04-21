import React from 'react';

import { observer } from 'mobx-react';

import Button from '../../../../components/UI/Button/Button';
import { useReportDataStore } from '../../../../models/useStore';

const ReportViewActionBar: React.FC = () => {
    const { modify } = useReportDataStore();

    return (
        <>
            <Button
                theme="primary"
                icon="save"
                iconPosition="left"
                fontSize={16}
                onClick={() => modify()}
            >
                Edit
            </Button>
            <Button
                theme="primary"
                icon="print"
                iconPosition="left"
                fontSize={16}
                onClick={() => {}}
            >
                Print
            </Button>
        </>
    );
};

export default observer(ReportViewActionBar);
