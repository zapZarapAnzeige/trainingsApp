import { createAction } from "@reduxjs/toolkit";
import { UserData } from "../types";

export const setUserData = createAction<UserData>("SET_USER");
