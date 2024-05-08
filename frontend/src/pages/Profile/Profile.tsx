import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import {
  Box,
  Typography,
  Divider,
  AspectRatio,
  IconButton,
  CardOverflow,
  Textarea,
  Stack,
  Card,
  FormLabel,
  FormControl,
  Input,
  Select,
  CardActions,
  Button,
  Option,
  Avatar,
  Switch,
} from "@mui/joy";

import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { PartnerData, UserData } from "../../types";
import { getImageFromBase64 } from "../../utils";
import { changeUserData, getUserData } from "../../api";
import { useAuthHeader } from "react-auth-kit";
import { useDispatch } from "react-redux";
import { changeUser } from "../../redux/reducers/userSlice";

type ProfileProps = {
  setViewProfile?: (viewProfile: boolean) => void;
  userData: PartnerData | UserData;
};

export const Profile: FC<ProfileProps> = ({ setViewProfile, userData }) => {
  const isUserData = (value: PartnerData | UserData): value is UserData => {
    return setViewProfile === undefined;
  };

  const [searchingForPartner, setSearchingForPartner] = useState<boolean>(
    isUserData(userData) ? userData.searchingForPartner : false
  );
  const [isDataDirty, setIsDataDirty] = useState<boolean>(false);
  const [bio, setBio] = useState<string>(userData.bio ?? "");
  const [name, setName] = useState<string>(userData.name);
  const [nickName, setNickname] = useState<string>(userData.nickname ?? "");
  const [plz, setPlz] = useState<string>(
    isUserData(userData) ? userData.plz ?? "" : ""
  );

  // TODO: can be done with 1 useState
  const [profilePicture, setProfilePicture] = useState<
    string | undefined | File
  >(userData.profilePicture);

  const [convertedProfilePicture, setConvertedProfilePicture] = useState<{
    picture: string | undefined;
    isObjectURL: boolean;
  }>({ picture: userData.profilePicture, isObjectURL: false });

  useEffect(() => {
    if (
      bio !== (userData.bio ?? "") ||
      nickName !== (userData.nickname ?? "") ||
      plz !== (isUserData(userData) ? userData.plz ?? "" : "") ||
      profilePicture !== userData.profilePicture
    ) {
      setIsDataDirty(true);
    } else {
      setIsDataDirty(false);
    }
  }, [bio, nickName, plz, profilePicture]);

  useEffect(() => {
    let fileURL: undefined | string;
    if (profilePicture && typeof profilePicture !== "string") {
      fileURL = URL.createObjectURL(profilePicture);
      setConvertedProfilePicture({
        picture: fileURL,
        isObjectURL: true,
      });
    }
    return () => {
      fileURL && URL.revokeObjectURL(fileURL);
    };
  }, [profilePicture]);

  const intl = useIntl();
  const auth = useAuthHeader();
  const dispatch = useDispatch();

  const getMessage = (id: string) => {
    return intl.formatMessage({ id: id });
  };

  const getProfileImage = (
    userName: string,
    base64Image?: string,
    isObjectURL?: boolean
  ) => {
    let image: any;
    if (!isObjectURL) {
      image = getImageFromBase64(base64Image);
    } else if (base64Image) {
      image = base64Image;
    }
    if (typeof image === "string") {
      return <img src={image} loading="lazy" alt="" />;
    } else {
      return <Avatar size="lg">{userName.charAt(0)}</Avatar>;
    }
  };

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Stack
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">
              {getMessage("profile.label.personalInfo")}
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
          >
            <Stack direction="column" spacing={1}>
              <AspectRatio
                ratio="1"
                maxHeight={200}
                sx={{ flex: 1, minWidth: 120, borderRadius: "100%" }}
              >
                {getProfileImage(
                  userData.name,
                  convertedProfilePicture.picture,
                  convertedProfilePicture.isObjectURL
                )}
              </AspectRatio>
              {isUserData(userData) && (
                <IconButton
                  aria-label="upload new picture"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  component="label"
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 100,
                    top: 170,
                    boxShadow: "sm",
                  }}
                >
                  <EditRoundedIcon />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ clip: "rect(0 0 0 0)", position: "absolute" }}
                    onChange={(e) => {
                      const files = (e.target as HTMLInputElement).files;

                      if (files && files.length > 0) {
                        setProfilePicture(files[0]);
                      }
                    }}
                  />
                </IconButton>
              )}
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormLabel>{getMessage("profile.label.name")}</FormLabel>
                <FormControl
                  sx={{
                    display: { sm: "flex-column", md: "flex-row" },
                    gap: 2,
                  }}
                >
                  <Input
                    disabled={true}
                    size="sm"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <Input
                    disabled={!isUserData(userData)}
                    size="sm"
                    placeholder={getMessage("profile.label.nickName")}
                    value={nickName}
                    onChange={(e) => {
                      setNickname(e.target.value);
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                </FormControl>
              </Stack>
              {isUserData(userData) && (
                <Stack direction="row" spacing={2}>
                  <FormLabel>
                    {getMessage("profile.label.lookingForPartner")}
                  </FormLabel>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <Switch
                      sx={{ m: "auto" }}
                      checked={searchingForPartner}
                      onChange={(event) =>
                        setSearchingForPartner(event.target.checked)
                      }
                    />
                  </FormControl>
                  <FormLabel>{getMessage("profile.label.plz")}</FormLabel>
                  <FormControl sx={{ flexGrow: 1 }}>
                    <Input
                      value={plz}
                      onChange={(e) => {
                        setPlz(e.target.value);
                      }}
                      size="sm"
                      startDecorator={<EmailRoundedIcon />}
                      placeholder={getMessage("profile.label.plz")}
                      sx={{ flexGrow: 1 }}
                    />
                  </FormControl>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Card>
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">
              {getMessage("profile.label.bio")}
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              disabled={!isUserData(userData)}
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
          </Stack>
          {isUserData(userData) && (
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button
                  disabled={!isDataDirty}
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  onClick={() => {
                    setSearchingForPartner(userData.searchingForPartner);
                    setBio(userData.bio ?? "");
                    setNickname(userData.nickname ?? "");
                    setConvertedProfilePicture({
                      picture: userData.profilePicture,
                      isObjectURL: false,
                    });
                    setProfilePicture(userData.profilePicture);
                    setPlz(userData.plz ?? "");
                  }}
                >
                  {getMessage("profile.label.cancel")}
                </Button>
                <Button
                  disabled={!isDataDirty}
                  size="sm"
                  variant="solid"
                  onClick={() => {
                    changeUserData(
                      auth(),
                      nickName,
                      searchingForPartner,
                      plz,
                      profilePicture,
                      bio
                    ).then((res) =>
                      getUserData(auth()).then((res) =>
                        dispatch(
                          changeUser({
                            id: userData.id,
                            name: userData.name,
                            searchingForPartner: res.data.searching_for_partner,
                            bio: res.data.bio,
                            nickname: res.data.nickname,
                            plz: res.data.plz,
                            profilePicture: res.data.profile_picture,
                          })
                        )
                      )
                    );
                  }}
                >
                  {getMessage("profile.label.save")}
                </Button>
              </CardActions>
            </CardOverflow>
          )}
        </Card>
      </Stack>
    </Box>
  );
};
