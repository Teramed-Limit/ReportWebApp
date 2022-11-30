import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { ReportImageData } from '../../../interface/document-data';
import { margin } from '../PDFReportContent/PDFReportContent';
import { styles } from '../styles/style';

interface Props {
    imageList: ReportImageData[];
}

const PDFPhoto = ({ imageList }: Props) => {
    return (
        <ReactPDF.View style={styles.gallery}>
            {imageList.map((image: ReportImageData) => {
                return (
                    <ReactPDF.View
                        key={image.SOPInstanceUID}
                        style={{
                            ...styles.imageContainer,
                            width: `${100 / 4 - margin * 2}%`,
                            minWidth: `${100 / 4 - margin * 2}%`,
                            maxWidth: `${100 / 4 - margin * 2}%`,
                            margin: `${margin}%`,
                        }}
                        wrap={false}
                    >
                        <ReactPDF.Image style={styles.image} src={image.thumbnailImageSrc} />
                        <ReactPDF.Text style={styles.imageNum}>
                            {image.MappingNumber > 0 && `${image.MappingNumber}`}
                        </ReactPDF.Text>
                        <ReactPDF.View style={styles.imageDescContainer}>
                            <ReactPDF.Text style={styles.imageDesc}>
                                {image.DescriptionOfSites}
                            </ReactPDF.Text>
                            <ReactPDF.Text style={styles.imageDesc}>
                                {image.DescriptionOfFindings}
                            </ReactPDF.Text>
                        </ReactPDF.View>
                    </ReactPDF.View>
                );
            })}
        </ReactPDF.View>
    );
};

export default PDFPhoto;
