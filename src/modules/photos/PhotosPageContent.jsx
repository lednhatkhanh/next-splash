import React from "react";
import PropTypes from "prop-types";
import { useMutation, queryCache, useInfiniteQuery } from "react-query";

import { Layout, PhotosList } from "~/components";
import { toggleLikePhotoMutation, fetchPhotos } from "~/fetchers";
import { AuthContext } from "~/containers";

export const PhotosPageContent = ({ photos: initialPhotos }) => {
  const { loggedIn } = React.useContext(AuthContext);
  const { data, isFetchingMore, fetchMore } = useFetchPhotos(initialPhotos);
  const toggleLikePhoto = useToggleLikePhotoMutation();
  const photos = React.useMemo(() => data.flat(1), [data]);

  const handleFetchMorePhotos = () => {
    fetchMore();
  };

  const handleToggleLike = async (photo) => {
    if (!loggedIn) {
      return;
    }

    await toggleLikePhoto({
      id: photo.id,
      type: photo.liked_by_user ? "unlike" : "like",
    });
  };

  return (
    <Layout>
      <PhotosList
        photos={photos}
        isFetchingMore={isFetchingMore}
        onFetchMore={handleFetchMorePhotos}
        onToggleLike={handleToggleLike}
      />
    </Layout>
  );
};

PhotosPageContent.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const useToggleLikePhotoMutation = () => {
  const [toggleLikePhoto] = useMutation(toggleLikePhotoMutation, {
    onMutate: ({ id: mutatingPhotoId, type }) => {
      const oldQueryData = queryCache.getQueryData("photos");

      queryCache.setQueryData(
        "photos",
        oldQueryData.map((page) =>
          page.map((currentPhoto) =>
            currentPhoto.id === mutatingPhotoId
              ? {
                  ...currentPhoto,
                  likes:
                    type === "unlike"
                      ? currentPhoto.likes - 1
                      : currentPhoto.likes + 1,
                  liked_by_user: type === "unlike" ? false : true,
                }
              : currentPhoto
          )
        )
      );

      return () => queryCache.setQueryData("photos", oldQueryData);
    },
    onError: (_err, _data, rollback) => rollback(),
    onSettled: () => {
      queryCache.refetchQueries("photos");
    },
  });

  return toggleLikePhoto;
};

const useFetchPhotos = (initialPhotos) => {
  const { fetchMore, data, isFetchingMore } = useInfiniteQuery({
    queryKey: "photos",
    queryFn: fetchPhotos,
    config: {
      getFetchMore(_lastPage, allPages) {
        return {
          page: allPages.length + 1,
        };
      },
      initialData: [initialPhotos],
    },
  });

  return {
    data,
    isFetchingMore,
    fetchMore,
  };
};
