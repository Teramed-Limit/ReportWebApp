import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { ReportImageData } from '../../../interface/document-data';
import { isEmptyOrNil } from '../../../utils/general';
import { margin } from '../PDFReportContent/PDFReportContent';
import { styles } from '../styles/style';

interface Props {
    imageList: ReportImageData[];
}

const PDFPhoto = ({ imageList }: Props) => {
    return (
        <ReactPDF.View style={styles.gallery}>
            {imageList.map((image: ReportImageData) => {
                // 上標記的影像，或是原影像
                const imageSrc = isEmptyOrNil(image?.EditedImageSrc)
                    ? image.thumbnailImageSrc
                    : image.EditedImageSrc;

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
                        <ReactPDF.Image style={styles.image} src={imageSrc} />
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
