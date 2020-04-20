import { useRouter } from "next/router";
import { useMutation, queryCache } from "react-query";

import { toggleLikePhotoMutation } from "~/fetchers";

export const useToggleLikePhotoMutation = () => {
  const router = useRouter();

  const [toggleLikePhoto] = useMutation(toggleLikePhotoMutation, {
    onMutate: ({ id: mutatingPhotoId, type }) => {
      const oldQueryData = queryCache.getQueryData([
        "searchPhotos",
        { query: router.query.query },
      ]);

      queryCache.setQueryData(
        ["searchPhotos", { query: router.query.query }],
        oldQueryData.map((page) => ({
          ...page,
          results: page.results.map((currentPhoto) =>
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
          ),
        }))
      );

      return () =>
        queryCache.setQueryData(
          ["searchPhotos", { query: router.query.query }],
          oldQueryData
        );
    },
    onError: (_err, _data, rollback) => rollback(),
    onSettled: () => {
      queryCache.refetchQueries([
        "searchPhotos",
        { query: router.query.query },
      ]);
    },
  });

  return toggleLikePhoto;
};
