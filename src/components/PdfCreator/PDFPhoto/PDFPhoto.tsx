import React, { useEffect, useState } from 'react';

import ReactPDF from '@react-pdf/renderer';

import { ReportImageData } from '../../../interface/document-data';
import { generateUUID, isEmptyOrNil } from '../../../utils/general';
import { styles } from '../styles/style';

interface Props {
    row: number;
    pageBreak: boolean;
    imageList: ReportImageData[];
}

const padding = 0.2;

const PDFPhoto = ({ row, pageBreak, imageList }: Props) => {
    const [emptyImageList, setEmptyImageList] = useState<string[]>([]);

    // 計算要填入多少空的位置
    useEffect(() => {
        if (imageList.length % row === 0) return;
        const fillCount = row - (imageList.length % row);
        const result: string[] = [];
        for (let i = 0; i < fillCount; i++) result.push(generateUUID());
        setEmptyImageList(result);
    }, [imageList.length, row]);

    return (
        <ReactPDF.View style={styles.gallery} break={pageBreak}>
            {imageList
                .sort((a, b) => {
                    if (a.ReportMark && b.ReportMark) {
                        return a.ReportMark.MappingNumber - b.ReportMark.MappingNumber;
                    }
                    return 0;
                })
                .map((image: ReportImageData) => {
                    // 上標記的影像，或是原影像
                    const imageSrc = isEmptyOrNil(image?.EditedImageSrc)
                        ? image.thumbnailImageSrc
                        : image.EditedImageSrc;

                    return (
                        <ReactPDF.View
                            key={image.SOPInstanceUID}
                            style={{
                                ...styles.imageContainer,
                                width: `${100 / row - padding * 2}%`,
                                minWidth: `${100 / row - padding * 2}%`,
                                maxWidth: `${100 / row - padding * 2}%`,
                                padding: `${padding}%`,
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
            {emptyImageList.map((uuid: string) => {
                return (
                    <ReactPDF.View
                        key={uuid}
                        style={{
                            ...styles.imageContainer,
                            width: `${100 / row - padding * 2}%`,
                            minWidth: `${100 / row - padding * 2}%`,
                            maxWidth: `${100 / row - padding * 2}%`,
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
