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
  FormHelperText,
  Option,
  Avatar,
} from "@mui/joy";

import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { PartnerData, UserData } from "../../types";
import { getImageFromBase64 } from "../../utils";

type ProfileProps = {
  setViewProfile?: (viewProfile: boolean) => void;
  userData: PartnerData | UserData;
};

export const Profile: FC<ProfileProps> = ({ setViewProfile, userData }) => {
  const isUserData = (value: PartnerData | UserData): value is UserData => {
    return setViewProfile === undefined;
  };

  const intl = useIntl();
  const [lookingForPartner, setLookingForPartner] = useState<boolean | null>(
    isUserData(userData) ? userData.searchingForPartner : false
  );
  const [bio, setBio] = useState<string>(userData.bio ?? "");
  const [name, setName] = useState<string>(userData.name);
  const [nickName, setNickname] = useState<string>(userData.nickname ?? "");
  const [plz, setPlz] = useState<string>(
    isUserData(userData) ? userData.plz ?? "" : ""
  );

  const getMessage = (id: string) => {
    return intl.formatMessage({ id: id });
  };

  const getProfileImage = (userName: string, base64Image?: string) => {
    const image = getImageFromBase64(base64Image);

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
                {getProfileImage(userData.name, userData.profilePicture)}
              </AspectRatio>
              {isUserData(userData) && (
                <IconButton
                  aria-label="upload new picture"
                  size="sm"
                  variant="outlined"
                  color="neutral"
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
                    <Select
                      value={lookingForPartner}
                      onChange={(e, newVal) => setLookingForPartner(newVal)}
                      size="sm"
                      startDecorator={<AccessTimeFilledRoundedIcon />}
                    >
                      <Option value={true}>
                        {getMessage("profile.label.yes")}
                      </Option>
                      <Option value={false}>
                        {getMessage("profile.label.no")}
                      </Option>
                    </Select>
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
                      defaultValue={
                        userData.name //TODO
                      }
                      sx={{ flexGrow: 1 }}
                    />
                  </FormControl>
                </Stack>
              )}
            </Stack>
          </Stack>

          {isUserData(userData) && (
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                  {getMessage("profile.label.cancel")}
                </Button>
                <Button size="sm" variant="solid">
                  {getMessage("profile.label.save")}
                </Button>
              </CardActions>
            </CardOverflow>
          )}
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
            {isUserData(userData) && (
              <FormHelperText sx={{ mt: 0.75, fontSize: "xs" }}>
                275 characters left
                {
                  //TODO
                }
              </FormHelperText>
            )}
          </Stack>
          {isUserData(userData) && (
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                  {getMessage("profile.label.cancel")}
                </Button>
                <Button size="sm" variant="solid">
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
