import React from 'react';

import { observer } from 'mobx-react';

import PdfPreview from '../../components/PdfPreview/PdfPreview';
import { useReportDataStore } from '../../models/useStore';

const Preview = () => {
    const { pdfFile } = useReportDataStore();
    return <PdfPreview pdf={pdfFile}> </PdfPreview>;
};

export default observer(Preview);
