import React from 'react';

import Select from 'react-select';

import classes from './BaseSelection.module.scss';

interface Props {
    id?: string;
    disabled?: boolean;
    options: any[];
    value: any;
    onValueChange: (options: any) => void;
    onInputChange?: (value: string) => void;
    isMulti: boolean;
    isLoading?: false;
    isSearchable?: true;
    getOptionValue?: (option) => void;
    getOptionLabel?: (option) => void;
}

// label is display text in dropdown
// value is key in dropdown
// TODO: Replace react-select to material select
const BaseSelection = ({
    id,
    disabled = false,
    value = null,
    onValueChange,
    options,
    isMulti = false,
    isLoading = false,
    isSearchable = true,
    onInputChange = () => {},
    getOptionValue,
    getOptionLabel,
}: Props) => {
    return (
        <Select
            id={id}
            isDisabled={disabled}
            className={classes.report__container}
            classNamePrefix="report"
            value={value}
            onChange={onValueChange}
            options={options}
            isMulti={isMulti}
            isLoading={isLoading}
            isSearchable={isSearchable}
            isClearable
            closeMenuOnSelect={!isMulti}
            onInputChange={onInputChange}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            menuShouldBlockScroll
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
        />
    );
};

export default BaseSelection;
