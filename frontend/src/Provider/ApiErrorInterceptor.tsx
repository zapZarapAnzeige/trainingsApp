import { getReasonPhrase } from "http-status-codes";
import { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import { PrimitiveType, useIntl } from "react-intl";
import { axiosInstance } from "../../../frontend/src/api";
import { ErrorDialog } from "../Common/ErrorDialog";
import { useSignOut } from "react-auth-kit";

export const ApiErrorInterceptor: FC = () => {
  const intl = useIntl();
  const logOut = useSignOut();

  const [errorMessage, setErrorMessage] = useState<string>("");

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
        setErrorMessage(errorMessage);
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

  return (
    <ErrorDialog
      open={errorMessage !== ""}
      closeErrorDialog={() => {
        setErrorMessage("");
      }}
      errorMessage={errorMessage}
    />
  );
};
