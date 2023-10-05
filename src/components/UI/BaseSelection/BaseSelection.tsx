import React from 'react';

import Select from 'react-select';
import { GetOptionLabel, GetOptionValue } from 'react-select/dist/declarations/src/types';

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
    getOptionValue?: GetOptionValue<any>;
    getOptionLabel?: GetOptionLabel<any>;
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
    getOptionValue,
    getOptionLabel,
}: Props) => {
    return (
        <Select
            id={id}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            isDisabled={disabled}
            className={classes.report__container}
            classNamePrefix="report"
            value={selectedOption}
            onChange={onSelectionChanged}
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
