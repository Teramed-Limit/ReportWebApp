import React, { useContext } from 'react';

import { observer } from 'mobx-react';
import { tap } from 'rxjs/operators';

import { NotificationContext } from '../../context/notification-context';
import { MessageType } from '../../interface/notification';
import { useReportDataStore } from '../../models/useStore';
import Button from '../UI/Button/Button';
import classes from './Navigation.module.scss';
import NavigationItem from './NavigationItem/NavigationItem';

const Navigation = () => {
    const { previewReport } = useReportDataStore();
    const { setSuccessNotification, setErrorNotification } = useContext(NotificationContext);
    const previewReportAndNotify = () => {
        previewReport(null, (signal$) =>
            signal$.pipe(
                tap(({ notification }) => {
                    return notification.messageType === MessageType.Success
                        ? setSuccessNotification(notification.message)
                        : setErrorNotification(notification.message);
                }),
            ),
        );
    };

    return (
        <div className={classes.nav}>
            <ul className={classes.navigationItems}>
                {/* <NavigationItem link="/home"> */}
                {/*    <Button id="navigation__btn-query" iconPosition="left" icon="query"> */}
                {/*        Query */}
                {/*    </Button> */}
                {/* </NavigationItem> */}
                {/* <NavigationItem link="/reporting"> */}
                {/*    <Button id="navigation__btn-reporting" iconPosition="left" icon="reporting"> */}
                {/*        Reporting */}
                {/*    </Button> */}
                {/* </NavigationItem> */}
                {/* <NavigationItem link="/photos"> */}
                {/*    <Button id="navigation__btn-photo" iconPosition="left" icon="photos"> */}
                {/*        Photos */}
                {/*    </Button> */}
                {/* </NavigationItem> */}
                {/* <NavigationItem link="/preview"> */}
                {/*    <Button */}
                {/*        id="navigation__btn-preview" */}
                {/*        iconPosition="left" */}
                {/*        icon="preview" */}
                {/*        onClick={previewReportAndNotify} */}
                {/*    > */}
                {/*        Preview */}
                {/*    </Button> */}
                {/* </NavigationItem> */}
            </ul>
        </div>
    );
};

export default observer(Navigation);
