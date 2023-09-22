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

const PDFReportFooter = ({ page, formData, userData }: Props) => {
    return (
        <>
            <ReactPDF.View
                fixed
                style={{
                    position: 'absolute',
                    width: page.width,
                    height: `${page.height}px`,
                    left: 0,
                    bottom: 0,
                }}
            >
                {page.components &&
                    Object.entries(page.components).map(([uuid, comp]) => {
                        const RenderComponent = PDFReportComponentMapper[comp.componentType];
                        if (!RenderComponent) return <></>;
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
        </>
    );
};

export default React.memo(PDFReportFooter);
