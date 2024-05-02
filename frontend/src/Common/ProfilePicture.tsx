import { FC } from "react";
import { Avatar, AvatarProps } from "@mui/joy";
import { getImageFromBase64 } from "../utils";

type ProfilePictureProps = {
  props?: AvatarProps;
  base64ProfilePicture?: string;
  partnerName?: string;
};

export const ProfilePicture: FC<ProfilePictureProps> = ({
  base64ProfilePicture,
  partnerName,
  props,
}) => {
  const image = getImageFromBase64(base64ProfilePicture);

  if (typeof image === "string") {
    return <Avatar size="sm" {...props} src={image} />;
  } else {
    return <Avatar>{partnerName ? partnerName.charAt(0) : ""}</Avatar>;
  }
};
