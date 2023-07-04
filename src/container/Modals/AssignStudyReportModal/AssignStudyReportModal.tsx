import React, { useContext, useEffect, useState } from 'react';

import { Button, ListItemAvatar } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import classes from './AssignStudyReportModal.module.scss';
import { assignedStudies, fetchAssignedStudies, unAssignedStudies } from '../../../axios/api';
import Modal from '../../../components/Modal/Modal';
import { ModalContext } from '../../../context/modal-context';
import { NotificationContext } from '../../../context/notification-context';
import { AssignedStudy } from '../../../interface/assigned-study';

interface Props {
    studyInstanceUid: string;
}

const AssignStudyReportModal = ({ studyInstanceUid }: Props) => {
    const setModal = useContext(ModalContext);
    const [assignedStudy, setAssignedStudy] = useState<AssignedStudy[]>([]);
    const { setErrorNotification } = useContext(NotificationContext);

    const onClose = () => {
        setModal(null);
    };

    const assignStudy = (userId: string) => {
        assignedStudies(studyInstanceUid, userId).subscribe({
            next: () => {
                setAssignedStudy((prev) => {
                    return prev.map((assignment) => {
                        if (assignment.UserID === userId)
                            return { ...assignment, AssignedTo: userId };
                        return assignment;
                    });
                });
            },
            error: () => {
                setErrorNotification('Assign Study Failed');
            },
        });
    };

    const unAssignStudy = (userId: string) => {
        unAssignedStudies(studyInstanceUid, userId).subscribe({
            next: () => {
                setAssignedStudy((prev) => {
                    return prev.map((assignment) => {
                        if (assignment.UserID === userId)
                            return { ...assignment, AssignedTo: undefined };
                        return assignment;
                    });
                });
            },
            error: () => {
                setErrorNotification('Unassign Study Failed');
            },
        });
    };

    useEffect(() => {
        fetchAssignedStudies(studyInstanceUid).subscribe((res) => {
            setAssignedStudy(res.data);
        });
    }, [studyInstanceUid]);

    const body = (
        <div className={classes.container}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {assignedStudy.map((data) => {
                    return (
                        <ListItem
                            key={data.UserID}
                            secondaryAction={
                                <Checkbox
                                    edge="end"
                                    onChange={(e, checked) =>
                                        checked
                                            ? assignStudy(data.UserID)
                                            : unAssignStudy(data.UserID)
                                    }
                                    checked={!!data.AssignedTo}
                                />
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText primary={data.UserName} secondary={data.UserID} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    const footer = (
        <>
            <Button variant="contained" color="primary" onClick={() => onClose()}>
                Close
            </Button>
        </>
    );

    return (
        <Modal
            open
            width="auto"
            height="500px"
            headerTitle="Assign Study to"
            body={body}
            footer={footer}
        />
    );
};

export default AssignStudyReportModal;
