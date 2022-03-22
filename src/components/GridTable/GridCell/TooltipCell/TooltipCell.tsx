import React from 'react';

const TooltipCell = (props) => {
    return (
        <div style={{ backgroundColor: props.color || 'white' }}>
            <p>
                <span>{props.value}</span>
            </p>
        </div>
    );
};

export default TooltipCell;
