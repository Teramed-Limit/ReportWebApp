import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { ReportImageDataset } from '../../../interface/document-data';
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
                            width: `${100 / 4}%`,
                            maxWidth: `${100 / 4}%`,
                            flex: `1 1 ${100 / 4}%`,
                            padding: 4,
                            paddingTop: 0,
                            paddingBottom: 8,
                        }}
                        wrap={false}
                    >
                        <Image
                            style={{
                                ...styles.image,
                                height: 'auto',
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
