import { StyleSheet } from '@react-pdf/renderer';

// Common
export const fontSize = 10;

// Style
export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: '20px',
        paddingBottom: '50px',
        fontFamily: 'ArinalUNI',
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
        height: '130',
        display: 'flex',
        flexDirection: 'row',
    },
    header_rightContent: {
        flex: '1 1 40%',
    },
    divider: {
        margin: '2px 0',
        height: '1px',
        width: '100%',
        backgroundColor: 'black',
    },
    header_patientContainer: {
        border: '2px solid black',
        height: '100%',
        width: '100%',
        padding: '6px',
        fontSize,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    header_patientInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    header_leftContent: {
        flex: '1 1 60%',
        width: 200,
        fontSize: 12,
        display: 'flex',
        justifyContent: 'space-between',
    },
    qrCode: {
        display: 'flex',
        alignSelf: 'flex-end',
        width: '75px',
        height: '75px',
    },
    hospitalLogo: {
        // width: '127px',
        // height: '100%',
        objectFit: 'contain',
        objectPosition: 'left top',
    },
    icon: {
        width: '13px',
        height: '13px',
        objectFit: 'contain',
        objectPosition: 'center',
    },
    section: {
        maxWidth: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    subSection: {
        maxWidth: '100%',
        width: '100%',
        display: 'flex',
    },
    fieldSection: {
        display: 'flex',
        margin: '3px 0',
    },
    // Label
    label: {
        fontSize,
        fontWeight: 'bold',
    },
    labelHorizontal: {
        flex: '1 1 35%',
    },
    labelVertical: {
        marginBottom: 3,
    },
    // Text value
    textValue: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        color: '#3a464d',
    },
    textValueHorizontal: {
        flex: '1 1 65%',
        padding: '0 2px',
    },
    textValueVertical: {},
    // Image
    gallery: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '100%',
    },
    imageContainer: {
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
    },
    imageDesc: {
        width: '100%',
        maxWidth: '100%',
        fontSize,
    },
});
