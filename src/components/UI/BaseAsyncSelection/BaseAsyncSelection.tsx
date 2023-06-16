import React from 'react';

import AsyncSelect from 'react-select/async';
import {
    GetOptionLabel,
    GetOptionValue,
    OptionsOrGroups,
} from 'react-select/dist/declarations/src/types';

import classes from './BaseAsyncSelection.module.scss';

interface Props {
    id?: string;
    disabled?: boolean;
    getOptions: (
        inputValue: string,
        callback: (options: OptionsOrGroups<any, any>) => void,
    ) => Promise<OptionsOrGroups<any, any>> | void;
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
const BaseAsyncSelection = ({
    id,
    disabled = false,
    selectedOption = null,
    onSelectionChanged,
    getOptions,
    isMulti = false,
    isLoading = false,
    isSearchable = true,
    onInputChange = () => {},
    getOptionValue,
    getOptionLabel,
}: Props) => {
    return (
        <AsyncSelect
            id={id}
            isDisabled={disabled}
            className={classes.report__container}
            classNamePrefix="report"
            value={selectedOption}
            onChange={onSelectionChanged}
            defaultOptions
            loadOptions={getOptions}
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

export default BaseAsyncSelection;
