import React from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

const InputProps = {
  startAdornment: (
    <InputAdornment position="start">
      <SearchIcon />
    </InputAdornment>
  ),
};

export const SearchPageSearchBox = ({ value, onSubmit, onChange }) => {
  return (
    <form method="POST" target="#" onSubmit={onSubmit}>
      <TextField
        InputProps={InputProps}
        value={value}
        variant="outlined"
        size="medium"
        type="search"
        fullWidth
        required
        onChange={onChange}
      />
    </form>
  );
};

SearchPageSearchBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
