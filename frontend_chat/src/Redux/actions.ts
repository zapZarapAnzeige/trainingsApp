import { createAction } from "@reduxjs/toolkit";
import { UserData_old } from "../types";

export const setUserData = createAction<UserData_old>("SET_USER");
