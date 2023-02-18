import React from 'react';

interface Props {
    isEditMode: boolean;
    titleComponent?: JSX.Element;
    viewComponent: JSX.Element;
    editComponent: JSX.Element;
}

const ViewEditSwitcher = ({ isEditMode, titleComponent, viewComponent, editComponent }: Props) => {
    return (
        <>
            {isEditMode ? (
                <>
                    {titleComponent}
                    {editComponent}
                </>
            ) : (
                <>
                    {titleComponent}
                    {viewComponent}
                </>
            )}
        </>
    );
};

export default ViewEditSwitcher;
