import React from 'react';

import classes from './Navigation.module.scss';

const Navigation = () => {
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

export default Navigation;
