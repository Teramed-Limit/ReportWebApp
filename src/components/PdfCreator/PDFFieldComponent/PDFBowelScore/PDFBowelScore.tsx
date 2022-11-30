import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import {
    CheckboxCheckedIcon,
    CheckboxUnCheckedIcon,
    ColonQualityA,
    ColonQualityB,
    ColonQualityC,
    ColonQualityD,
} from '../../../../assets';

const styles = ReactPDF.StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
    },
    header: {
        fontSize: '10px',
        padding: '8px',
        display: 'flex',
        border: '1px solid #babfc7',
    },
    gridContainer: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #babfc7',
    },
    column: {
        display: 'flex',
        flexDirection: 'row',
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flexWrap: 'nowrap',
        fontSize: '10px',
        padding: '6px',
        flex: '1 1 11%',
        border: '1px solid #babfc7',
    },
    bowelImage: {
        width: '100%',
        maxWidth: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
    },
    footer: {
        display: 'flex',
        alignItems: 'flex-end',
        marginTop: '4px',
        fontSize: '10px',
    },
    icon: {
        marginRight: '3px',
        width: '13px',
        height: '13px',
        objectFit: 'contain',
        objectPosition: 'center',
    },
});

interface Props {
    bowelData: {
        BBPS_Right: number;
        BBPS_Transverse: number;
        BBPS_Left: number;
    };
}

const scoreList = [
    { scoreText: '3', score: 3 },
    { scoreText: '2', score: 2 },
    { scoreText: '1', score: 1 },
    { scoreText: '0', score: 0 },
    { scoreText: 'N/A', score: -1 },
];

const PDFBowelScore = ({ bowelData }: Props) => {
    const scoreElement = (position: string, id: string) => {
        return (
            <ReactPDF.View style={styles.column}>
                <ReactPDF.View style={styles.item}>
                    <ReactPDF.Text>{position}</ReactPDF.Text>
                </ReactPDF.View>
                {scoreList.map((scoreDetails) => {
                    return (
                        <ReactPDF.View key={scoreDetails.scoreText} style={styles.item}>
                            {bowelData[id] === scoreDetails.score ? (
                                <ReactPDF.Image
                                    style={{ ...styles.icon }}
                                    src={CheckboxCheckedIcon}
                                />
                            ) : (
                                <ReactPDF.Image
                                    style={{ ...styles.icon }}
                                    src={CheckboxUnCheckedIcon}
                                />
                            )}
                            <ReactPDF.Text>{scoreDetails.scoreText}</ReactPDF.Text>
                        </ReactPDF.View>
                    );
                })}
            </ReactPDF.View>
        );
    };

    const calculateTotalScore = () => {
        const ignoreNoneScore = (score) => {
            if (score < 0) return 0;
            return score;
        };
        return (
            ignoreNoneScore(bowelData.BBPS_Right) +
            ignoreNoneScore(bowelData.BBPS_Left) +
            ignoreNoneScore(bowelData.BBPS_Transverse)
        );
    };

    return (
        <ReactPDF.View style={styles.container}>
            <ReactPDF.View style={styles.gridContainer}>
                <ReactPDF.View style={styles.header}>
                    <ReactPDF.Text>Boston Bowel Preparation Scale</ReactPDF.Text>
                </ReactPDF.View>
                {/* First column */}
                <ReactPDF.View style={styles.column}>
                    <ReactPDF.View style={styles.item} />
                    <ReactPDF.View style={styles.item}>
                        <ReactPDF.Image style={styles.bowelImage} src={ColonQualityD} />
                    </ReactPDF.View>
                    <ReactPDF.View style={styles.item}>
                        <ReactPDF.Image style={styles.bowelImage} src={ColonQualityC} />
                    </ReactPDF.View>
                    <ReactPDF.View style={styles.item}>
                        <ReactPDF.Image style={styles.bowelImage} src={ColonQualityB} />
                    </ReactPDF.View>
                    <ReactPDF.View style={styles.item}>
                        <ReactPDF.Image style={styles.bowelImage} src={ColonQualityA} />
                    </ReactPDF.View>
                    <ReactPDF.View style={styles.item} />
                </ReactPDF.View>
                {/* Score column */}
                {scoreElement('Right', 'BBPS_Right')}
                {scoreElement('Transverse', 'BBPS_Transverse')}
                {scoreElement('Left', 'BBPS_Left')}
            </ReactPDF.View>
            <ReactPDF.View style={styles.footer}>
                <ReactPDF.Text>Total Score: {calculateTotalScore()}</ReactPDF.Text>
            </ReactPDF.View>
        </ReactPDF.View>
    );
};

export default React.memo(PDFBowelScore);
