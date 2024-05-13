import axios, { AxiosResponse } from "axios";
import {
  ExerciseAdd,
  ExerciseInfo,
  ExercisesAddDialog,
  ExercisesEntryData,
  Training,
} from "./types";

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
export const getTrainingData = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      "/trainingSchedule",
      addAuth(token)
    );
    return response.data as Training[];
  } catch (error) {
    throw error;
  }
};

export const getExercisesData = async (token: string) => {
  try {
    const response = await axiosInstance.get("/exercisesData", addAuth(token));
    return response.data as ExercisesEntryData[];
  } catch (error) {
    throw error;
  }
};

// Add Dialog
// done
export const getExercisesAdd = async (token: string, exercise: string) => {
  try {
    const response = await axiosInstance.get("/exercisesAdd", {
      ...addAuth(token),
      params: { exercise: exercise },
    });

    return response.data as ExerciseAdd;
  } catch (error) {
    throw error;
  }
};

// Info Dialog
// done
export const getExercisesInfo = async (token: string, exercise: string) => {
  try {
    const response = await axiosInstance.get("/exercisesInfo", {
      ...addAuth(token),
      params: { exercise: exercise },
    });
    return response.data as ExerciseInfo;
  } catch (error) {
    throw error;
  }
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
  axiosInstance.post("/ExercisesAdd", undefined, {
    ...addAuth(token),
    params: { exercisesAdd: exercisesAdd },
  });
};

export const postExerciseNewUserRating = async (
  token: string,
  userRating: number,
  excercise: string
) => {
  axiosInstance.post("/ExerciseRating", undefined, {
    ...addAuth(token),
    params: { userRating: userRating, excercise: excercise },
  });
};
