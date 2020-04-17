export const useExtractPhotoMetadata = (photo) => {
  const username = `@${photo.user.username}`;
  const description =
    photo.alt_description ?? photo.description ?? `A photo of ${username}`;

  return { username, description };
};
