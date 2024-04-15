import { FC } from "react";
import { Avatar } from "@mui/joy";

type ProfilePictureProps = {
  base64ProfilePicture?: string;
  partnerName?: string;
};

const getImageExtension = (base64ProfilePicture: string) => {
  switch (base64ProfilePicture.charAt(0)) {
    case "/":
      return "jpg";

    case "i":
      return "png";

    case "R":
      return "gif";

    case "U":
      return "webp";

    case "B":
      return "bmp";

    case "T":
      return "tiff";

    case "S":
      return "svg";

    case "E":
      return "eps";

    case "P":
      return "psd";

    case "I":
      return "ico";

    default:
      return "";
  }
};

const getImageFromBase64 = (
  partnerName?: string,
  base64ProfilePicture?: string
) => {
  const altIcon = <Avatar>{partnerName ? partnerName.charAt(0) : ""}</Avatar>;
  let extension = "";
  if (base64ProfilePicture) {
    extension = getImageExtension(base64ProfilePicture);
  } else {
    return altIcon;
  }
  if (extension === "") {
    return altIcon;
  }
  return (
    <Avatar
      size="sm"
      src={"data:image/" + extension + ";base64," + base64ProfilePicture}
    />
  );
};

export const ProfilePicture: FC<ProfilePictureProps> = ({
  base64ProfilePicture,
  partnerName,
}) => {
  return getImageFromBase64(partnerName, base64ProfilePicture);
};
