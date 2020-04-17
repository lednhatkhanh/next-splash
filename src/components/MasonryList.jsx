import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import { useIntersectionObserver, useSsrMediaQuery } from "~/hooks";

export const MasonryList = ({
  items,
  renderItem,
  isFetchingMore,
  onFetchMore,
  isFetching,
}) => {
  const classes = useStyles();

  const observerTriggerRef = React.useRef(null);

  const handleIntersect = React.useCallback(() => {
    if (onFetchMore) {
      onFetchMore();
    }
  }, [onFetchMore]);

  useIntersectionObserver(observerTriggerRef.current, handleIntersect);

  const columnsCount = useColumnsCount();
  const columns = React.useMemo(
    () =>
      items
        .reduce((columns, item, itemIndex) => {
          const columnIndex = itemIndex % columnsCount;

          if (!columns[columnIndex]) {
            columns[columnIndex] = [];
          }

          columns[columnIndex].push(renderItem(item, itemIndex));

          return columns;
        }, [])
        .map((column, columnIndex) => (
          <div key={columnIndex} className={classes.column}>
            {column}
          </div>
        )),
    [classes.column, columnsCount, items, renderItem]
  );

  return (
    <>
      {isFetching && (
        <div className={classes.progressContainer}>
          <CircularProgress />
        </div>
      )}

      {!isFetching && (
        <>
          <div className={classes.root}>{columns}</div>

          <div ref={observerTriggerRef} className={classes.observerTrigger} />

          {isFetchingMore && (
            <div className={classes.progressContainer}>
              <CircularProgress />
            </div>
          )}
        </>
      )}
    </>
  );
};

MasonryList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderItem: PropTypes.func.isRequired,
  isFetchingMore: PropTypes.bool,
  onFetchMore: PropTypes.func,
  isFetching: PropTypes.bool,
};

const useColumnsCount = () => {
  const theme = useTheme();
  const isMdUp = useSsrMediaQuery(theme.breakpoints.up("md"));
  const isSm = useSsrMediaQuery(theme.breakpoints.only("sm"));

  const columnsCount = React.useMemo(() => {
    if (isMdUp) {
      return 3;
    }

    if (isSm) {
      return 2;
    }

    return 1;
  }, [isMdUp, isSm]);

  return columnsCount;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridAutoFlow: "column",
    gridColumnGap: theme.spacing(4),
    padding: theme.spacing(4, 0, 0, 0),
    width: "100%",
  },
  column: {
    display: "grid",
    gridAutoFlow: "row",
    gridAutoRows: "min-content",
    gridRowGap: theme.spacing(4),
  },
  observerTrigger: { width: "100%", height: theme.spacing(4) },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4, 0),
  },
}));
