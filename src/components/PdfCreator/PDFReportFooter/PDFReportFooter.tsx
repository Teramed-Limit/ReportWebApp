import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { UserAccountInfo } from '../../../interface/auth';
import { DocumentData } from '../../../interface/document-data';
import { RepPage } from '../../../interface/report-generator/rep-page';
import { PDFReportComponentMapper } from '../PDFComponents/PDFCompMapper';

interface Props {
    zoom: number;
    page: RepPage;
    formData: DocumentData;
    userData: UserAccountInfo;
    children?: React.ReactNode;
}

const PDFReportFooter = ({ zoom, page, formData, userData, children }: Props) => {
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
                                zoom={zoom}
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

export default React.memo(PDFReportFooter);
