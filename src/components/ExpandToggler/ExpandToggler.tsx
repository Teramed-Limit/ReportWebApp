import React from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const StyledAccordion = styled(Accordion)(() => ({
    '&.MuiAccordion-root': {
        margin: '0 !important',
        boxShadow: 'none',
    },
    '&.MuiAccordion-root.Mui-expanded': {
        boxShadow: 'none',
        margin: '0 !important',
    },
    '&.MuiAccordion-root:before': {
        display: 'none',
    },
}));

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
    minHeight: '36px', // 設定展開時的最小高度
    borderBottom: 'solid 1px rgba(0, 0, 0, 0.35)',
    padding: '0 0 0 8px',
    margin: 0,

    '&.Mui-expanded .MuiAccordionSummary-content': {
        margin: 0, // 展開時設定內容區塊的邊距為0
    },
    '&.Mui-expanded': {
        minHeight: '36px', // 設定展開時的最小高度
        margin: 0,
    },
    '.MuiAccordionSummary-content': {
        padding: 0,
        margin: 0,
    },
    '.MuiPaper-root': {
        margin: 0,
    },
}));

const StyledAccordionDetails = styled(AccordionDetails)(() => ({
    minHeight: '36px', // 設定展開時的最小高度
    padding: 0,
    margin: 0,
    '&.MuiCollapse-root': {
        padding: 0,
    },
    '&.MuiAccordionDetails-root': {
        paddingLeft: '12px',
    },
}));

interface Props {
    title: string;
    defaultExpanded?: boolean;
    children?: React.ReactNode;
}

const ExpandToggler = ({ title, children, defaultExpanded = true }: Props) => {
    return (
        <StyledAccordion sx={{ margin: '0' }} defaultExpanded={defaultExpanded}>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{title}</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>{children}</StyledAccordionDetails>
        </StyledAccordion>
    );
};

export default ExpandToggler;
