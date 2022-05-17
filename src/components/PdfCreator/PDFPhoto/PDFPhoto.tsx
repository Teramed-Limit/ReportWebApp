import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { ReportImageDataset } from '../../../interface/document-data';
import { styles } from '../styles/style';

interface Props {
    row: number;
    col: number;
    imageList: ReportImageDataset[];
}

const paddingMap = {
    '2*2': 4,
    '2*3': 40,
    '3*3': 4,
};

const PDFPhoto = ({ row, col, imageList }: Props) => {
    return (
        <View style={styles.gallery}>
            {imageList.map((image: ReportImageDataset) => {
                return (
                    <View
                        key={image.SOPInstanceUID}
                        style={{
                            ...styles.imageContainer,
                            width: `${100 / row}%`,
                            maxWidth: `${100 / row}%`,
                            flex: `1 1 ${100 / row}%`,
                            padding: `4px ${paddingMap[`${row}*${col}`]}px`,
                        }}
                        wrap={false}
                    >
                        <Image style={{ ...styles.image }} src={image.ImageSrc} />
                        {image.MappingNumber > 0 && (
                            <Text style={styles.imageDesc}>
                                {image.MappingNumber}) {image.DescriptionOfFindings}
                            </Text>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

export default PDFPhoto;
