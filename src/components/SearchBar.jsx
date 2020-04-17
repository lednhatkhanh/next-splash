import React from "react";
import PropTypes from "prop-types";
import {
  InputBase,
  makeStyles,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Search as SearchIcon, Close as CloseIcon } from "@material-ui/icons";

export const SearchBar = ({ className, onClose, onSearch }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = React.useState("");

  const handleInputChange = React.useCallback((event) => {
    setInputValue(event.target.value);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch(inputValue);
  };

  return (
    <form
      className={className}
      method="POST"
      target="#"
      onSubmit={handleSubmit}
    >
      <InputBase
        id="query"
        name="query"
        value={inputValue}
        autoFocus
        type="search"
        classes={classes}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton color="inherit" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        }
        aria-label="Search"
        required
        onChange={handleInputChange}
      />
    </form>
  );
};

SearchBar.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    color: "inherit",
    width: "100%",
  },
  input: {
    height: 40,
  },
}));
