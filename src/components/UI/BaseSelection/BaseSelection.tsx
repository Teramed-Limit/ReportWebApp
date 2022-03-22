import React from 'react';

import Select from 'react-select';

import classes from './BaseSelection.module.scss';

interface Props {
    id?: string;
    disabled?: boolean;
    options: any[];
    selectedOption: any;
    onSelectionChanged: (options: any) => void;
    onInputChange?: (value: string) => void;
    isMulti: boolean;
    isLoading?: false;
    isSearchable?: true;
}

// label is display text in dropdown
// value is key in dropdown
// TODO: Replace react-select to material select
const BaseSelection = ({
    id,
    disabled = false,
    selectedOption = null,
    onSelectionChanged,
    options,
    isMulti = false,
    isLoading = false,
    isSearchable = true,
    onInputChange = () => {},
}: Props) => {
    return (
        <Select
            id={id}
            isDisabled={disabled}
            className={classes.report__container}
            classNamePrefix="report"
            value={selectedOption}
            onChange={onSelectionChanged}
            options={options}
            isMulti={isMulti}
            isLoading={isLoading}
            isSearchable={isSearchable}
            closeMenuOnSelect={!isMulti}
            onInputChange={onInputChange}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            menuShouldBlockScroll
        />
    );
};

export default BaseSelection;
