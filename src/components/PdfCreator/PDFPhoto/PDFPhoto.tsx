import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { ReportImageDataset } from '../../../interface/document-data';
import { styles } from '../styles/style';

interface Props {
    row: number;
    col: number;
    imageList: ReportImageDataset[];
}

const sizeMap = {
    '2*2': { padding: '4px', diagramHeight: '202px' },
    '2*3': { padding: '40px', diagramHeight: '148px' },
    '3*3': { padding: '4px', diagramHeight: '133px' },
};

const PDFPhoto = ({ row, col, imageList }: Props) => {
    return (
        <View style={styles.gallery}>
            {imageList.map((image: ReportImageDataset, index) => {
                return (
                    <View
                        key={image.SOPInstanceUID}
                        style={{
                            ...styles.imageContainer,
                            width: `${100 / row}%`,
                            maxWidth: `${100 / row}%`,
                            flex: `1 1 ${100 / row}%`,
                            padding: `16px ${sizeMap[`${row}*${col}`].padding}`,
                        }}
                        wrap={false}
                    >
                        <Image
                            style={{
                                ...styles.image,
                                height:
                                    index === 0 ? sizeMap[`${row}*${col}`].diagramHeight : 'auto',
                            }}
                            src={image.ImageSrc}
                        />
                        <Text style={{ ...styles.imageDesc }}>
                            {image.MappingNumber > 0 && `${image.MappingNumber}) `}
                            {image.DescriptionOfFindings}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

export default PDFPhoto;
