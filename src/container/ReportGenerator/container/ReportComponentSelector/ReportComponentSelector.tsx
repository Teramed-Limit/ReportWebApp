import React from 'react';

import { lighten, Stack, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';

import AttributeList from '../../../../components/AttributeList/AttributeList';
import ColorPickerButton from '../../../../components/ColorPickerButton/ColorPickerButton';
import TabPanel from '../../../../components/TabPanel/TabPanel';
import BaseNativeSelection from '../../../../components/UI/BaseNativeSelection/BaseNativeSelection';
import { useChildModalMove } from '../../../../hooks/useModalMove/useChildModalMove';
import { ModalMoveEvent } from '../../../../hooks/useModalMove/useParentModalMove';
import { RepComponent } from '../../../../interface/rep-report';
import ComponentSelector from '../../components/ComponentSelector/ComponentSelector';
import classes from '../ReportDefineAttributeEditor/ReportDefineAttributeEditor.module.scss';

interface Props {
    id: string;
    attribute?: RepComponent;
    onModalReadyToMove: (id: string) => void;
    onSetAttribute: (
        uuid: string,
        attrPath: (number | string)[],
        attrValue: number | string | boolean,
    ) => void;
}

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

const ReportComponentSelector = React.forwardRef<ModalMoveEvent, Props>(
    ({ id, attribute = undefined, onModalReadyToMove, onSetAttribute }: Props, ref) => {
        const { modalPosition, moveElementRef, onMouseDown, onMouseUp } = useChildModalMove(ref, {
            left: 0,
            top: 0,
        });

        const [value, setValue] = React.useState(0);
        const handleChange = (event: React.SyntheticEvent, newValue: number) => {
            setValue(newValue);
        };

        return (
            <Stack
                ref={moveElementRef}
                direction="column"
                style={{
                    position: 'absolute',
                    left: `${modalPosition.left}px`,
                    top: `${modalPosition.top}px`,
                }}
                className={classes.container}
            >
                <div
                    className={classes.moveable}
                    onMouseDown={(e) => {
                        onMouseDown(e);
                        onModalReadyToMove(id);
                    }}
                    onMouseUp={onMouseUp}
                />

                <Stack
                    sx={{ width: '100%', height: '100%', p: 1, overflow: 'hidden' }}
                    direction="column"
                >
                    <StyleTabs value={value} onChange={handleChange}>
                        <StyleTab label="Component"></StyleTab>
                        <StyleTab label="Attribute" />
                        <StyleTab label="Page" />
                    </StyleTabs>
                    <TabPanel value={value} index={0}>
                        <ComponentSelector />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <AttributeList
                            attribute={attribute || {}}
                            setAttribute={(attrName: (string | number)[], attrValue: any) => {
                                if (!attribute?.uuid) return;
                                onSetAttribute(attribute.uuid, attrName, attrValue);
                            }}
                            filterType="exclude"
                            excludeAttribute={['componentType', 'x', 'y', 'valueType', 'uuid']}
                            attributeComponentMapper={{
                                fontColor: [
                                    {
                                        name: '',
                                        component: ColorPickerButton,
                                    },
                                ],
                                fontName: [
                                    {
                                        name: '',
                                        component: BaseNativeSelection,
                                        props: {
                                            options: [
                                                { label: 'Noto Sans TC', value: 'Noto Sans TC' },
                                                { label: 'Arial', value: 'Arial' },
                                            ],
                                        },
                                    },
                                ],
                                fontWeight: [
                                    {
                                        name: '',
                                        component: BaseNativeSelection,
                                        props: {
                                            options: [
                                                { label: 'Thin', value: 200 },
                                                { label: 'Normal', value: 400 },
                                                { label: 'Bold', value: 800 },
                                            ],
                                        },
                                    },
                                ],
                                fontStyle: [
                                    {
                                        name: '',
                                        component: BaseNativeSelection,
                                        props: {
                                            options: [
                                                { label: 'Normal', value: 'normal' },
                                                // { label: 'Italic', value: 'italic' },
                                            ],
                                        },
                                    },
                                ],
                            }}
                        />
                    </TabPanel>
                </Stack>
            </Stack>
        );
    },
);

export default ReportComponentSelector;
