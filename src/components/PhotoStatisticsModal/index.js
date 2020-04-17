import dynamic from "next/dynamic";

export const DynamicPhotoStatisticsModal = dynamic(() =>
  import("./PhotoStatisticsModal").then((mod) => mod.PhotoStatisticsModal)
);
