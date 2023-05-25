import * as React from 'react';
import { useState } from 'react';

import { Paper } from '@mui/material';
import { observer } from 'mobx-react';

import classes from './SignatureTab.module.scss';
import { define } from '../../../constant/setting-define';
import GridTableEditor from '../../../layout/GridTableEditor/GridTableEditor';

const SignatureTab = () => {
    const [initFormData] = useState({
        userId: '',
        jobTitle: '',
        title: '',
        summary: '',
        name: '',
        signatureUrl: '',
        createDateTime: '',
        modifiedDateTime: '',
    });

    return (
        <Paper elevation={3} className={classes.container}>
            <div className={`${classes.tableContainer}`}>
                <GridTableEditor
                    apiPath="doctor-signature"
                    identityId="userId"
                    colDef={define.doctorSignature.colDef}
                    formDef={define.doctorSignature.formDef}
                    initFormData={initFormData}
                />
            </div>
        </Paper>
    );
};

export default observer(SignatureTab);
