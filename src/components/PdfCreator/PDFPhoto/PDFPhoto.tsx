import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { ReportImageData } from '../../../interface/document-data';
import { margin } from '../PDFReportContent/PDFReportContent';
import { styles } from '../styles/style';

interface Props {
    imageList: ReportImageData[];
}

const PDFPhoto = ({ imageList }: Props) => {
    return (
        <View style={styles.gallery}>
            {imageList.map((image: ReportImageData) => {
                return (
                    <View
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
                        <Image style={styles.image} src={image.thumbnailImageSrc} />
                        <Text style={styles.imageNum}>
                            {image.MappingNumber > 0 && `${image.MappingNumber}`}
                        </Text>
                        <View style={styles.imageDescContainer}>
                            <Text style={styles.imageDesc}>{image.DescriptionOfSites}</Text>
                            <Text style={styles.imageDesc}>{image.DescriptionOfFindings}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

export default PDFPhoto;
