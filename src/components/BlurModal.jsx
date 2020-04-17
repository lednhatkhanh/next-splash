import React from "react";
import { Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

export const BlurModal = ({ className, ...rest }) => {
  const classes = useBlurModalStyles();

  return <Modal className={clsx(classes.modal, className)} {...rest} />;
};

const useBlurModalStyles = makeStyles(() => ({
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(20px)",
  },
}));
