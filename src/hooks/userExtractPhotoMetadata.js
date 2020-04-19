export const useExtractPhotoMetadata = (photo) => {
  if (!photo) {
    return { username: undefined, description: undefined };
  }

  const username = photo.user ? `@${photo.user.username}` : undefined;
  const description =
    photo.alt_description ??
    photo.description ??
    (username ? `A photo of ${username}` : undefined);

  return { username, description };
};
