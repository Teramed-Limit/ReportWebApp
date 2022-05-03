import React, { useState } from 'react';

import { Image, Text, View } from '@react-pdf/renderer';

import { ReportImageDataset } from '../../../interface/document-data';
import { styles } from '../styles/style';

interface Props {
    imageList: ReportImageDataset[];
    diagramData: string;
}

const PDFPhoto = ({ imageList, diagramData }: Props) => {
    // Jpeg file format (as many others) can be identified by magic number.
    // For JPEG the magic number is ff d8 ff at offset 0.
    // If you encode this to Base64, you'll always get /9j/.
    const [images] = useState<ReportImageDataset[]>([
        ...[
            {
                SOPInstanceUID: 'Diagram',
                ImageSrc: `data:image/${
                    diagramData?.substr(0, 4) === '/9j/' ? 'jpg' : 'png'
                };base64,${diagramData}`,
                IsAttachInReport: true,
                MappingNumber: -1,
                DescriptionOfFindings: '',
            },
        ],
        ...imageList.filter((image) => image.IsAttachInReport),
    ]);

    if (!diagramData || !imageList) return <></>;

    return (
        <View style={styles.gallery}>
            {images.map((image: ReportImageDataset) => {
                return (
                    <View key={image.SOPInstanceUID} style={styles.imageContainer} wrap={false}>
                        <Image style={styles.image} src={image.ImageSrc} />
                        <Text style={styles.imageDesc}>{image.DescriptionOfFindings}</Text>
                    </View>
                );
            })}
            {images.map((image: ReportImageDataset) => {
                return (
                    <View key={image.SOPInstanceUID} style={styles.imageContainer} wrap={false}>
                        <Image style={styles.image} src={image.ImageSrc} />
                        <Text style={styles.imageDesc}>{image.DescriptionOfFindings}</Text>
                    </View>
                );
            })}
            {images.map((image: ReportImageDataset) => {
                return (
                    <View key={image.SOPInstanceUID} style={styles.imageContainer} wrap={false}>
                        <Image style={styles.image} src={image.ImageSrc} />
                        <Text style={styles.imageDesc}>{image.DescriptionOfFindings}</Text>
                    </View>
                );
            })}
            {images.map((image: ReportImageDataset) => {
                return (
                    <View key={image.SOPInstanceUID} style={styles.imageContainer} wrap={false}>
                        <Image style={styles.image} src={image.ImageSrc} />
                        <Text style={styles.imageDesc}>{image.DescriptionOfFindings}</Text>
                    </View>
                );
            })}
        </View>
    );
};

export default PDFPhoto;
