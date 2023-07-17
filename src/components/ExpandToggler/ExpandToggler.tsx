import React from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
    '&.Mui-expanded .MuiAccordionSummary-content': {
        margin: 0, // 展開時設定內容區塊的邊距為0
    },
    '&.Mui-expanded': {
        minHeight: '48px', // 設定展開時的最小高度
    },
}));

interface Props {
    title: string;
    children?: React.ReactNode;
}

const ExpandToggler = ({ title, children }: Props) => {
    return (
        <Accordion defaultExpanded>
            <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{title}</Typography>
            </StyledAccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
};

export default ExpandToggler;
