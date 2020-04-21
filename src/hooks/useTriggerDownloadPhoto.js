import React from 'react';
import { useQuery } from 'react-query';
import { fetchTrackPhotoDownload } from '~/fetchers';

export const useTriggerDownloadPhoto = (photo) => {
  const { refetch } = useQuery(['trackPhotoDownload', photo.id], fetchTrackPhotoDownload, {
    manual: true,
  });

  const triggerDownload = React.useCallback(() => {
    const href = `${photo.links.download}?force=true`;

    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.setAttribute('download', 'download');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [photo]);

  const triggerTrackPhotoDownload = React.useCallback(async () => {
    refetch();
  }, [refetch]);

  const downloadPhoto = React.useCallback(() => {
    triggerDownload();
    triggerTrackPhotoDownload();
  }, [triggerDownload, triggerTrackPhotoDownload]);

  return [downloadPhoto];
};
