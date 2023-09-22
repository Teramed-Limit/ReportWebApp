import React from 'react';

interface Props {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
}

const PagePaddingPseudo = ({ paddingTop, paddingRight, paddingLeft, paddingBottom }: Props) => {
    return (
        <>
            {/* top padding pseudo */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: paddingTop,
                    background: '#ccc',
                }}
            />
            {/* bottom padding pseudo */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: paddingBottom,
                    background: '#ccc',
                }}
            />
            {/* right padding pseudo */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: paddingRight,
                    height: '100%',
                    background: '#ccc',
                }}
            />
            {/* left padding pseudo */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: paddingLeft,
                    height: '100%',
                    background: '#ccc',
                }}
            />
        </>
    );
};

export default PagePaddingPseudo;
