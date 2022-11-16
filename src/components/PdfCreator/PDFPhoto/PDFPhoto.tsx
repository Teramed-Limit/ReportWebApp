import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { ReportImageDataset } from '../../../interface/document-data';
import { margin } from '../PDFReportContent/PDFReportContent';
import { styles } from '../styles/style';

interface Props {
    imageList: ReportImageDataset[];
}

const PDFPhoto = ({ imageList }: Props) => {
    return (
        <View style={styles.gallery}>
            {imageList.map((image: ReportImageDataset) => {
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
                        <Image style={styles.image} src={image.ImageSrc} />
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
