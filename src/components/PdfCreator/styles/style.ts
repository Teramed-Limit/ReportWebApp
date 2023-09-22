import ReactPDF from '@react-pdf/renderer';

// Style
export const styles = ReactPDF.StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',
        fontFamily: 'Microsoft JhengHei',
    },
    checkbox: {
        display: 'flex',
        flexDirection: 'row',
    },
    icon: {
        marginRight: '2px',
        width: '13px',
        height: '13px',
        objectFit: 'contain',
        objectPosition: 'center',
    },
    // Image
    gallery: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    item: {
        padding: '1px',
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
    },
    imageNum: {
        fontWeight: 'bold',
        fontSize: '18px',
        position: 'absolute',
        color: 'white',
        padding: '4px',
        left: 0,
        top: 0,
    },
});
