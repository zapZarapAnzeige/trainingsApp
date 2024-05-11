import axios, { AxiosResponse } from "axios";
import { ExercisesAddDialog, Training } from "./types";

export const axiosInstance = axios.create({
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
  baseURL: "http://127.0.0.1:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const addAuth = (token: string) => {
  return { headers: { Authorization: token } };
};

export const getChatHistory = async (token: string, partnerId: number) => {
  return await axiosInstance.get("/chat/content", {
    ...addAuth(token),
    params: { partner_id: partnerId },
  });
};

export const getChatsOverview = (token: string) => {
  return axiosInstance.get("/chats", addAuth(token));
};

export const getUsers = (
  token: string,
  onSuccess: (res: AxiosResponse) => void
) => {
  return axiosInstance.get("/users", addAuth(token)).then((res) => {
    res && onSuccess(res);
  });
};

export const signUp = async (username: string, password: string) => {
  await axiosInstance.post(
    "/api/v1/signUp",
    new URLSearchParams({ username: username, password: password })
  );
};

export const login = async (username: string, password: string) => {
  return await axiosInstance.post(
    "/api/v1/login",
    new URLSearchParams({ username: username, password: password })
  );
};
export const getUserData = (token: string) => {
  return axiosInstance.get("/users/me", addAuth(token));
};

export const findNewPartner = (token: string, plz: string) => {
  return axiosInstance.post("/chat", undefined, {
    ...addAuth(token),
    params: { plz: plz },
  });
};

export const changeUserData = (
  token: string,
  nickname?: string,
  searchingForPartner?: boolean,
  plz?: string,
  profilePicture?: File | string,
  bio?: string
) => {
  let formData: FormData | undefined = undefined;
  if (profilePicture && typeof profilePicture !== "string") {
    formData = new FormData();
    // if profilePicture is of type string it was not updated and therefore does not have to be updated
    formData.append("profile_picture", profilePicture);
  }
  return axiosInstance.put("user", formData, {
    ...addAuth(token),
    params: {
      plz: plz,
      nickname: nickname,
      searching_for_partner: searchingForPartner,
      bio: bio,
    },
  });
};

export const changeBlockStatus = (
  token: string,
  currentlyBlocked: boolean,
  partnerId: number
) => {
  axiosInstance.patch("/chat", undefined, {
    ...addAuth(token),
    params: {
      currently_blocked: currentlyBlocked,
      partner_id: partnerId,
    },
  });
};

// Gets
export const getTrainingData = (token: string) => {
  return axiosInstance.get("/trainingSchedule", addAuth(token));
};

export const getExercisesData = (token: string) => {
  return axiosInstance.get("/exercisesData", addAuth(token));
};

export const getExercisesAdd = (token: string) => {
  return axiosInstance.get("/exercisesAdd", addAuth(token));
};

export const getExercisesInfo = (token: string) => {
  return axiosInstance.get("/exercisesInfo", addAuth(token));
};

// Posts
export const postTrainingData = (token: string, trainingData: Training[]) => {
  axiosInstance.post("/trainingSchedule", undefined, {
    ...addAuth(token),
    params: { trainingData: trainingData },
  });
};

export const postExercisesAdd = (
  token: string,
  exercisesAdd: ExercisesAddDialog
) => {
  axiosInstance.post("/ExercisesAdd", undefined, {
    ...addAuth(token),
    params: { exercisesAdd: exercisesAdd },
  });
};

export const postExerciseNewUserRating = (
  token: string,
  userRating: number,
  excercise: string
) => {
  axiosInstance.post("/ExerciseRating", undefined, {
    ...addAuth(token),
    params: { userRating: userRating, excercise: excercise },
  });
};
