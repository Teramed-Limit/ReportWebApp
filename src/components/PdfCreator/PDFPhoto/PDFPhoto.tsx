import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { ReportImageData } from '../../../interface/document-data';
import { Field } from '../../../interface/report-field/field';
import { isEmptyOrNil } from '../../../utils/general';
import { styles } from '../styles/style';

interface Props {
    pdfStyle: {
        imagePerRow: number;
        imagePageBreak: boolean;
        pagePadding: number;
    };
    imageDefine: Field[];
    imageList: ReportImageData[];
}

const PDFPhoto = ({ pdfStyle, imageDefine, imageList }: Props) => {
    const customSort = (a, b) => {
        if (a.MappingNumber === 0) return 1;
        if (b.MappingNumber === 0) return -1;
        return a.MappingNumber - b.MappingNumber;
    };

    // 計算總共幾行，在把Image分別塞到div裡面
    let columnCount = Math.ceil(imageList.length / pdfStyle.imagePerRow);
    if (columnCount < 1) columnCount = 1;
    const columnArray = [...Array(columnCount).keys()];

    return (
        <ReactPDF.View break={pdfStyle.imagePageBreak}>
            {columnArray.map((column) => {
                const renderImageList = imageList
                    .sort(customSort)
                    .slice(
                        pdfStyle.imagePerRow * column,
                        pdfStyle.imagePerRow + pdfStyle.imagePerRow * column,
                    );

                return (
                    <ReactPDF.View
                        key={column}
                        style={{
                            ...styles.gallery,
                            paddingRight: pdfStyle.pagePadding,
                            paddingLeft: pdfStyle.pagePadding,
                        }}
                    >
                        {renderImageList.map((image: ReportImageData) => {
                            // 上標記的影像，或是原影像
                            const imageSrc = isEmptyOrNil(image?.EditedImageSrc)
                                ? image.thumbnailImageSrc
                                : image.EditedImageSrc;

                            return (
                                <ReactPDF.View
                                    key={image.SOPInstanceUID}
                                    style={{
                                        ...styles.item,
                                        width: `calc(${100 / pdfStyle.imagePerRow}%)`,
                                        maxWidth: `calc(${100 / pdfStyle.imagePerRow}%)`,
                                    }}
                                    wrap={false}
                                >
                                    <ReactPDF.Image style={styles.image} src={imageSrc} />
                                    <ReactPDF.Text style={styles.imageNum}>
                                        {image.MappingNumber > 0 && `${image.MappingNumber}`}
                                    </ReactPDF.Text>
                                    <ReactPDF.View style={styles.imageDescContainer}>
                                        {imageDefine.map((field) => {
                                            const value = image[field.id];
                                            return (
                                                <ReactPDF.Text
                                                    key={field.id}
                                                    style={{ ...field.valueStyle }}
                                                >
                                                    {value}
                                                </ReactPDF.Text>
                                            );
                                        })}
                                    </ReactPDF.View>
                                </ReactPDF.View>
                            );
                        })}
                    </ReactPDF.View>
                );
            })}
        </ReactPDF.View>
    );
};

export default PDFPhoto;
