import axios, { AxiosResponse } from "axios";
import {
  CalendarData,
  CalendarDayData,
  Exercise,
  ExerciseAdd,
  ExerciseInfo,
  ExercisesAddDialog,
  ExercisesEntryData,
  Training,
} from "./types";
import { keysToCamelCase } from "./utils";

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

//done
export const getChatHistory = async (token: string, partnerId: number) => {
  return await axiosInstance.get("/chat/content", {
    ...addAuth(token),
    params: { partner_id: partnerId },
  });
};

// done
export const getChatsOverview = (token: string) => {
  return axiosInstance.get("/chats", addAuth(token));
};

//done
export const getUsers = (
  token: string,
  onSuccess: (res: AxiosResponse) => void
) => {
  return axiosInstance.get("/users", addAuth(token)).then((res) => {
    res && onSuccess(res);
  });
};
//done
export const signUp = async (username: string, password: string) => {
  await axiosInstance.post(
    "/api/v1/signUp",
    new URLSearchParams({ username: username, password: password })
  );
};
//done
export const login = async (username: string, password: string) => {
  return await axiosInstance.post(
    "/api/v1/login",
    new URLSearchParams({ username: username, password: password })
  );
};

//done
export const getUserData = (token: string) => {
  return axiosInstance.get("/users/me", addAuth(token));
};
//done
export const findNewPartner = (token: string, plz: string) => {
  return axiosInstance.post("/chat", undefined, {
    ...addAuth(token),
    params: { plz: plz },
  });
};

//done
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

//done
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
export const getPastTrainings = async (token: string, week: string) => {
  const response = await axiosInstance.get("/pastTrainings", {
    ...addAuth(token),
    params: { start_date: week },
  });

  return keysToCamelCase(response.data) as CalendarDayData[];
};

export const getFutureTrainings = async (token: string, week: string) => {
  const response = await axiosInstance.get("/futureTrainings", {
    ...addAuth(token),
    params: { start_date: week },
  });

  return keysToCamelCase(response.data) as CalendarDayData[];
};

//done
export const getTrainingData = async (token: string) => {
  const response = await axiosInstance.get("/trainingSchedule", addAuth(token));

  return keysToCamelCase(response.data) as Training[];
};

// For TrainingSchedule
//done
export const getExercises = async (token: string) => {
  const response = await axiosInstance.get("/exercises", addAuth(token));
  return keysToCamelCase(response.data) as Exercise[];
};

// I dont know if keysToCamelCase will break on String[] so dont even use it
//done
export const getTags = async (token: string) => {
  const response = await axiosInstance.get("/tags", addAuth(token));
  return response.data as string[];
};

//done
export const getExercisesData = async (token: string) => {
  const response = await axiosInstance.get("/exercisesData", addAuth(token));
  return keysToCamelCase(response.data) as ExercisesEntryData[];
};

// Add Dialog
// done
export const getExercisesAdd = async (token: string, exercise: string) => {
  const response = await axiosInstance.get("/exercisesAdd", {
    ...addAuth(token),
    params: { exercise: exercise },
  });

  return keysToCamelCase(response.data) as ExerciseAdd;
};

// Info Dialog
// done
export const getExercisesInfo = async (token: string, exercise: string) => {
  const response = await axiosInstance.get("/exercisesInfo", {
    ...addAuth(token),
    params: { exercise: exercise },
  });
  return keysToCamelCase(response.data) as ExerciseInfo;
};

// Posts
export const postTrainingData = async (
  token: string,
  trainingData: Training
) => {
  axiosInstance.post("/trainingSchedule", undefined, {
    ...addAuth(token),
    params: { trainingData: trainingData },
  });
};

export const postExercisesAdd = async (
  token: string,
  exercisesAdd: ExercisesAddDialog
) => {
  axiosInstance.put("/ExercisesAdd", undefined, {
    ...addAuth(token),
    params: { exercisesAdd: exercisesAdd },
  });
};

export const postExerciseNewUserRating = async (
  token: string,
  userRating: number,
  exercise: string
) => {
  axiosInstance.post("/ExerciseRating", undefined, {
    ...addAuth(token),
    params: { userRating: userRating, exercise: exercise },
  });
};

export const postCalendar = async (
  token: string,
  calendarData: CalendarData,
  week: string
) => {
  axiosInstance.post("/Calendar", undefined, {
    ...addAuth(token),
    params: { calendarData: calendarData, week: week },
  });
};
