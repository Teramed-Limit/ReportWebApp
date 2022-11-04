import { StyleSheet } from '@react-pdf/renderer';

// Common
export const fontSize = 10;
export const footerHeight = '92px';

// Style
export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: '14px',
        paddingBottom: footerHeight,
        fontFamily: 'Arial',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    header: {
        width: '100%',
        minHeight: '68px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerReportContainer: {
        display: 'flex',
        height: '100%',
        justifyContent: 'flex-end',
    },
    headerReport: {
        fontSize: 16,
        fontFamily: 'Times-Bold',
        color: '#0070C0',
    },
    divider: {
        margin: '2px 0',
        height: '1px',
        width: '100%',
        backgroundColor: 'black',
    },
    hospitalLogo: {
        flex: 1,
        maxWidth: '50%',
        objectFit: 'contain',
        objectPosition: 'left top',
    },
    footer: {
        fontFamily: 'Arial',
        fontSize: '10px',
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: '45%',
    },
    signatureContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    signatureImage: {
        flex: 1,
        width: 'auto',
        height: '60px',
        margin: 'auto',
        objectFit: 'contain',
        objectPosition: 'left top',
    },
    signatureTextContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    signatureTitle: {
        display: 'flex',
        flex: '1 1 40%',
        color: '#00B050',
    },
    signatureContent: {
        flex: '1 1 60%',
        display: 'flex',
    },
    signatureDoctor: {
        display: 'flex',
        color: '#0000FF',
    },
    signatureSummary: {
        display: 'flex',
        color: '#0000FF',
    },
    icon: {
        width: '13px',
        height: '13px',
        objectFit: 'contain',
        objectPosition: 'center',
    },
    // Image
    gallery: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '100%',
    },
    imageContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItem: 'center',
    },
    image: {
        width: '100%',
        maxWidth: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
        height: 'auto',
    },
    imageDescContainer: {
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        fontSize,
    },
    imageNum: {
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: '18px',
        position: 'absolute',
        color: 'white',
        padding: '4px',
        left: 0,
        top: 0,
    },
    imageDesc: {
        textAlign: 'center',
        display: 'flex',
        width: '100%',
        maxWidth: '100%',
    },
});
