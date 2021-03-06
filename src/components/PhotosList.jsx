import React from 'react';
import PropTypes from 'prop-types';
import { MasonryList } from './MasonryList';
import { PhotoItem } from './PhotoItem';

export const PhotosList = ({ photos, onFetchMore, isFetchingMore, isFetching, onToggleLike }) => {
  const handleRenderPhoto = React.useCallback(
    (photo, photoIndex) => {
      return <PhotoItem key={`${photo.id}-${photoIndex}`} photo={photo} onToggleLike={onToggleLike} />;
    },
    [onToggleLike],
  );

  return (
    <MasonryList
      items={photos}
      renderItem={handleRenderPhoto}
      onFetchMore={onFetchMore}
      isFetchingMore={isFetchingMore}
      isFetching={isFetching}
    />
  );
};

PhotosList.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFetchMore: PropTypes.func,
  isFetchingMore: PropTypes.bool,
  isFetching: PropTypes.bool,
  onToggleLike: PropTypes.func.isRequired,
};
