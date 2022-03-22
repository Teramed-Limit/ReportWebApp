import React, { useState } from 'react';

import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { tap } from 'rxjs/operators';

import { MessageType, Notification } from '../../interface/notification';
import { useStore } from '../../models/useStore';
import classes from './ErrorPage.module.scss';

const ErrorPage = () => {
    const { queryParams, isQueryParamsValid, setQueryParams, initialize } = useStore();
    const history = useHistory();

    const [error, setError] = useState('');
    const [episodeNo, setEpisodeNo] = useState(queryParams.episodeNo);
    const [procedureId, setProcedureId] = useState(queryParams.procedureId);
    const [dept, setDept] = useState(queryParams.dept);
    const [staffCode, setStaffCode] = useState(queryParams.staffCode);

    async function onRetry() {
        setQueryParams({ episodeNo, procedureId, dept, staffCode });
        await initialize({ episodeNo, procedureId, dept, staffCode }, (signal$) =>
            signal$.pipe(
                tap((notification: Notification) => {
                    setError(notification.message);
                    if (notification.messageType === MessageType.Success) {
                        history.push(
                            `reporting/?episodeNo=${episodeNo}&procedureId=${procedureId}&dept=${dept}&staffCode=${staffCode}`,
                        );
                    }
                }),
            ),
        );
    }

    return (
        <div className={classes.container}>
            <div className={classes.page}>
                <h1>ERROR</h1>
                <div className={classes.msg}>
                    <h2>{!isQueryParamsValid ? 'Please assign params below.' : error}</h2>
                </div>
                <div className={classes.form}>
                    <label>
                        <div>Episode No</div>
                        <input
                            type="text"
                            value={episodeNo}
                            onChange={(event) => setEpisodeNo(event.target.value)}
                            placeholder="EpisodeNo..."
                        />
                    </label>
                    <label>
                        <div>Procedure Id</div>
                        <input
                            type="text"
                            value={procedureId}
                            onChange={(event) => setProcedureId(event.target.value)}
                            placeholder="ProcedureId..."
                        />
                    </label>
                    <label>
                        <div>Dept</div>
                        <input
                            type="text"
                            value={dept}
                            onChange={(event) => setDept(event.target.value)}
                            placeholder="Dept..."
                        />
                    </label>
                    <label>
                        <div>Staff Code</div>
                        <input
                            type="text"
                            value={staffCode}
                            onChange={(event) => setStaffCode(event.target.value)}
                            placeholder="Staff Code..."
                        />
                    </label>
                    <button type="button" onClick={onRetry}>
                        Retry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(ErrorPage);
