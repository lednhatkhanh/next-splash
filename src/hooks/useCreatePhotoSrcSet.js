import React from "react";
import { DeviceInfoContext } from "~/containers";

export const useCreatePhotoSrcSet = (photo, widths) => {
  const { dpr } = React.useContext(DeviceInfoContext);

  const srcSet = React.useMemo(
    () =>
      widths
        .map(
          (width) =>
            `${photo.urls.raw}&dpr=${dpr}q=60&fit=crop&auto=format&w=${width} ${width}w`
        )
        .join(", "),
    [dpr, photo.urls.raw, widths]
  );

  return srcSet;
};
