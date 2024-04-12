import { getReasonPhrase } from "http-status-codes";
import { AxiosError } from "axios";
import { FC, useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import { PrimitiveType, useIntl } from "react-intl";
import { axiosInstance } from "../api";
import { useErrorDialog } from "./ErrorDialogProvider";

export const ApiErrorInterceptor: FC = () => {
  const intl = useIntl();
  const logOut = useSignOut();
  const { openErrorDialog } = useErrorDialog();

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      (res) => res,
      (err: AxiosError<any, any>) => {
        const errorMessage = formatApiErrors(
          err.response && err.response.data && err.response.data.detail
            ? err.response.data.detail
            : err.message,
          err.response?.status
        );
        openErrorDialog(errorMessage);
        return Promise.resolve();
      }
    );
  }, []);

  const getMessage = (
    id: string,
    args?: Record<string, PrimitiveType>
  ): string => {
    return args
      ? intl.formatMessage({ id: id }, args)
      : intl.formatMessage({ id: id });
  };

  const formatApiErrors = (message: string, code?: number): string => {
    if (!code) {
      return getMessage("error.unknown");
    } else {
      if ((code = 401)) {
        if (message === "Token has expired or is not present") {
          logOut();
          return getMessage("error.tokenExpired");
        } else if (
          message === "User does not have Permission to view this sheet"
        ) {
          return getMessage(message);
        } else if (message === "No sheets present") {
          return message;
        } else if (message === "Not authorized to delete this sheet") {
          return message;
        }
        return getReasonPhrase(code);
      } else {
        return getReasonPhrase(code);
      }
    }
  };

  return <></>;
};