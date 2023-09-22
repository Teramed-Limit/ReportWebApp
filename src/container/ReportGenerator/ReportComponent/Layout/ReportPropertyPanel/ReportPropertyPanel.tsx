import React from 'react';

import { lighten, Stack, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';

import TabPanel from '../../../../../components/TabPanel/TabPanel';
import { RepComponentAttribute } from '../../../../../interface/report-generator/rep-attribute';
import { RepPage } from '../../../../../interface/report-generator/rep-page';
import classes from '../../../ReportDefine/Attribute/ReportDefineAttributeEditor/ReportDefineAttributeEditor.module.scss';
import ReportComponentAttributeList from '../../Attribute/ReportComponentAttributeList/ReportComponentAttributeList';
import ReportPageAttribute from '../../Attribute/ReportPageAttribute/ReportPageAttribute';
import ComponentSelector from '../ComponentSelector/ComponentSelector';

const StyleTabs = styled(Tabs)({
    borderBottom: '1px solid #e8e8e8',
    '& .MuiTabs-indicator': {
        backgroundColor: 'mediumslateblue',
    },
});

const StyleTab = styled((props: { label: string }) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        minWidth: 0,
        marginRight: theme.spacing(1),

        color: lighten('#7B68EE', 0.5),
        fontSize: '0.875em',
        fontWeight: 'bold',
        fontFamily: ['Roboto', 'Helvetica', 'Arial', 'Roboto', 'sans-serif'].join(','),
        '&:hover': {
            color: lighten('#7B68EE', 0.2),
        },
        '&.Mui-selected': {
            color: 'mediumslateblue',
        },
        '&.Mui-focusVisible': {
            color: 'mediumslateblue',
        },
    }),
);

interface Props {
    headerPage: RepPage;
    footerPage: RepPage;
    compAttribute?: RepComponentAttribute;
    onSetCompAttribute: (
        uuid: string,
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => void;
    onSetPageAttribute: (
        pageName: string,
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => void;
}

const ReportPropertyPanel = ({
    headerPage,
    footerPage,
    compAttribute = undefined,
    onSetCompAttribute,
    onSetPageAttribute,
}: Props) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Stack direction="column" className={classes.container}>
            <Stack
                sx={{ width: '100%', height: '100%', p: 1, overflow: 'hidden' }}
                direction="column"
            >
                <StyleTabs value={value} onChange={handleChange}>
                    <StyleTab label="Component" />
                    <StyleTab label="Attribute" />
                    <StyleTab label="Page" />
                </StyleTabs>
                {/* Component */}
                <TabPanel value={value} index={0}>
                    <ComponentSelector />
                </TabPanel>
                {/* Attribute */}
                <TabPanel value={value} index={1}>
                    <ReportComponentAttributeList
                        compAttribute={compAttribute}
                        onSetCompAttribute={onSetCompAttribute}
                    />
                </TabPanel>
                {/* Page */}
                <TabPanel value={value} index={2}>
                    <ReportPageAttribute
                        pageAttribute={headerPage}
                        onSetPageAttribute={(attrPath: (number | string)[], attrValue: any) =>
                            onSetPageAttribute('header', attrPath, attrValue)
                        }
                    />
                    <ReportPageAttribute
                        pageAttribute={footerPage}
                        onSetPageAttribute={(
                            attrPath: (number | string)[],
                            attrValue: number | string | boolean,
                        ) => onSetPageAttribute('footer', attrPath, attrValue)}
                    />
                </TabPanel>
            </Stack>
        </Stack>
    );
};

export default ReportPropertyPanel;
