import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { ReportImageData } from '../../../interface/document-data';
import { isEmptyOrNil } from '../../../utils/general';
import { styles } from '../styles/style';

interface Props {
    pdfStyle: {
        imagePerRow: number;
        imagePageBreak: boolean;
        fontSize: number;
        pagePadding: number;
    };
    imageList: ReportImageData[];
}

const padding = 0.2;

const PDFPhoto = ({ pdfStyle, imageList }: Props) => {
    const emptyImageList: string[] = [];
    if (imageList.length % pdfStyle.imagePerRow !== 0) {
        const fillCount = pdfStyle.imagePerRow - (imageList.length % pdfStyle.imagePerRow);
        for (let i = 0; i < fillCount; i++) emptyImageList.push(i.toString());
    }

    const customSort = (a, b) => {
        if (a.MappingNumber === 0) return 1;
        if (b.MappingNumber === 0) return -1;
        return a.MappingNumber - b.MappingNumber;
    };

    return (
        <ReactPDF.View
            style={{
                ...styles.gallery,
                paddingRight: pdfStyle.pagePadding,
                paddingLeft: pdfStyle.pagePadding,
            }}
            break={pdfStyle.imagePageBreak}
        >
            {imageList.sort(customSort).map((image: ReportImageData) => {
                // 上標記的影像，或是原影像
                const imageSrc = isEmptyOrNil(image?.EditedImageSrc)
                    ? image.thumbnailImageSrc
                    : image.EditedImageSrc;

                return (
                    <ReactPDF.View
                        key={image.SOPInstanceUID}
                        style={{
                            ...styles.imageContainer,
                            width: `${100 / pdfStyle.imagePerRow - padding * 2}%`,
                            minWidth: `${100 / pdfStyle.imagePerRow - padding * 2}%`,
                            maxWidth: `${100 / pdfStyle.imagePerRow - padding * 2}%`,
                            padding: `${padding}%`,
                        }}
                        wrap={false}
                    >
                        <ReactPDF.Image style={styles.image} src={imageSrc} />
                        <ReactPDF.Text style={styles.imageNum}>
                            {image.MappingNumber > 0 && `${image.MappingNumber}`}
                        </ReactPDF.Text>
                        <ReactPDF.View style={styles.imageDescContainer}>
                            <ReactPDF.Text
                                style={{ ...styles.imageDesc, fontSize: pdfStyle.fontSize }}
                            >
                                {image.DescriptionOfSites}
                            </ReactPDF.Text>
                            <ReactPDF.Text
                                style={{ ...styles.imageDesc, fontSize: pdfStyle.fontSize }}
                            >
                                {image.DescriptionOfFindings}
                            </ReactPDF.Text>
                        </ReactPDF.View>
                    </ReactPDF.View>
                );
            })}
            {emptyImageList.map((id: string) => {
                return (
                    <ReactPDF.View
                        key={id}
                        style={{
                            ...styles.imageContainer,
                            width: `${100 / pdfStyle.imagePerRow - padding * 2}%`,
                            minWidth: `${100 / pdfStyle.imagePerRow - padding * 2}%`,
                            maxWidth: `${100 / pdfStyle.imagePerRow - padding * 2}%`,
                            padding: `${padding}%`,
                        }}
                        wrap={false}
                    />
                );
            })}
        </ReactPDF.View>
    );
};

export default PDFPhoto;
