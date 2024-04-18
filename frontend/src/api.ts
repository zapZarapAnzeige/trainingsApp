import axios, { AxiosResponse } from "axios";

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
  return axiosInstance.post(
    "/chat",
    {},
    { ...addAuth(token), params: { plz: plz } }
  );
};

export const changeBlockStatus = (
  token: string,
  currentlyBlocked: boolean,
  partnerId: number
) => {
  axiosInstance.patch(
    "/chat",
    {
      currently_blocked: currentlyBlocked,
      partner_id: partnerId,
    },
    {
      ...addAuth(token),
      params: {
        currently_blocked: currentlyBlocked,
        partner_id: partnerId,
      },
    }
  );
};
