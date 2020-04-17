import React from "react";
import PropTypes from "prop-types";
import { Typography, Divider, Paper, makeStyles } from "@material-ui/core";
import {
  VisibilityOutlined as VisibilityOutlinedIcon,
  GetAppOutlined as GetAppOutlinedIcon,
  StraightenOutlined as StraightenOutlinedIcon,
  PhotoOutlined as PhotoOutlinedIcon,
  CameraAltOutlined as CameraAltOutlinedIcon,
  TimelapseOutlined as TimelapseOutlinedIcon,
  CameraOutlined as CameraOutlinedIcon,
  IsoOutlined as IsoOutlinedIcon,
  AllOutOutlined as AllOutOutlinedIcon,
  ColorLensOutlined as ColorLensOutlinedIcon,
} from "@material-ui/icons";
import { useQuery } from "react-query";

import { fetchPhotoStatistics } from "~/fetchers";
import { formatDateTime } from "~/utils";
import { StatisticsItem } from "./StatisticsItem";
import { BlurModal } from "../BlurModal";
import { ExifStatisticsItem } from "./ExifStatisticsItem";

export const PhotoStatisticsModal = ({ photoDetails, onClose }) => {
  const classes = useStyles();
  const {
    data: photoStatistics,
    isFetching: isFetchingPhotoStatistics,
  } = useQuery(["photoStatistics", photoDetails.id], fetchPhotoStatistics, {
    staleTime: Infinity,
  });
  const publishedAt = React.useMemo(
    () => formatDateTime(new Date(photoDetails.updated_at)),
    [photoDetails]
  );

  return (
    <BlurModal
      className={classes.modal}
      open={!!photoDetails}
      onClose={onClose}
    >
      <Paper className={classes.card}>
        <Typography component="h3" variant="h5">
          Info
        </Typography>

        <Typography variant="subtitle2" component="span">
          Published at {publishedAt}
        </Typography>

        <div className={classes.content}>
          <StatisticsItem
            label="Views"
            icon={<VisibilityOutlinedIcon />}
            loading={isFetchingPhotoStatistics}
            helperText={
              photoStatistics
                ? `+${photoStatistics.views.historical.change} since last month`
                : undefined
            }
          >
            {photoDetails.views}
          </StatisticsItem>

          <StatisticsItem
            label="Downloads"
            icon={<GetAppOutlinedIcon />}
            loading={isFetchingPhotoStatistics}
            helperText={
              photoStatistics
                ? `+${photoStatistics.downloads.historical.change} since last month`
                : undefined
            }
          >
            {photoDetails.downloads}
          </StatisticsItem>

          <Divider className={classes.divider} />

          <ExifStatisticsItem
            label="Dimensions"
            icon={<StraightenOutlinedIcon />}
            content={`${photoDetails.width} x ${photoDetails.height}`}
          />

          <ExifStatisticsItem
            label="Color"
            icon={<ColorLensOutlinedIcon />}
            content={photoDetails.color}
          />

          <ExifStatisticsItem
            label="Camera make"
            icon={<PhotoOutlinedIcon />}
            content={photoDetails.exif.make}
          />

          <ExifStatisticsItem
            label="Camera model"
            icon={<CameraAltOutlinedIcon />}
            content={photoDetails.exif.model}
          />

          <ExifStatisticsItem
            label="Exposure time"
            icon={<TimelapseOutlinedIcon />}
            content={photoDetails.exif.exposure_time}
          />

          <ExifStatisticsItem
            label="Aperture"
            icon={<CameraOutlinedIcon />}
            content={photoDetails.exif.aperture}
          />

          <ExifStatisticsItem
            label="Iso"
            icon={<IsoOutlinedIcon />}
            content={photoDetails.exif.iso}
          />

          <ExifStatisticsItem
            label="Focal Length"
            icon={<AllOutOutlinedIcon />}
            content={photoDetails.exif.focal_length}
          />
        </div>
      </Paper>
    </BlurModal>
  );
};

PhotoStatisticsModal.propTypes = {
  photoDetails: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0, 1),
    },
  },
  card: {
    padding: theme.spacing(3),
    minWidth: 600,
    outline: "none",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      minWidth: 0,
    },
  },
  content: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridColumnGap: theme.spacing(3),
    gridRowGap: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
      gridRowGap: theme.spacing(3),
    },
  },
  divider: {
    gridColumn: "1 / -1",
  },
}));
