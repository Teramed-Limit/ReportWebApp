import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { UserAccountInfo } from '../../../interface/auth';
import { DocumentData } from '../../../interface/document-data';
import { RepPage } from '../../../interface/report-generator/rep-page';
import { PDFReportComponentMapper } from '../PDFComponents/PDFCompMapper';

interface Props {
    page: RepPage;
    formData: DocumentData;
    userData: UserAccountInfo;
    children?: React.ReactNode;
}

const PDFReportHeader = ({ page, formData, userData, children }: Props) => {
    return (
        <>
            <ReactPDF.View
                fixed
                style={{
                    position: 'relative',
                    width: `100%`,
                    height: `${page.height}px`,
                }}
            >
                {page.components &&
                    Object.entries(page.components).map(([uuid, comp]) => {
                        const RenderComponent = PDFReportComponentMapper[comp.componentType];
                        if (!RenderComponent) return <React.Fragment key={uuid} />;
                        return (
                            <RenderComponent
                                key={uuid}
                                uuid={uuid}
                                comp={comp}
                                page={page}
                                formData={formData}
                                userData={userData}
                            />
                        );
                    })}
            </ReactPDF.View>
            <ReactPDF.View fixed>{children}</ReactPDF.View>
        </>
    );
};

export default React.memo(PDFReportHeader);
