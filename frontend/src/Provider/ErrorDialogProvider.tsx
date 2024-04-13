import { createContext, useContext, useState, ReactNode } from "react";
import ErrorDialog from "../Common/ErrorDialog";

type ErrorDialogContextType = {
  openErrorDialog: (message: string, onClose?: VoidFunction) => void;
};

const ErrorDialogContext = createContext<ErrorDialogContextType | undefined>(
  undefined
);

export const useErrorDialog = () => {
  const context = useContext(ErrorDialogContext);
  if (!context) {
    throw new Error("No Provider present");
  }
  return context;
};

type ErrorDialogProviderProps = {
  children: ReactNode;
};

export const ErrorDialogProvider = ({ children }: ErrorDialogProviderProps) => {
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [onCloseAction, setOnCloseAction] = useState<VoidFunction>(() => {});

  const openErrorDialog = (message: string, onClose?: VoidFunction) => {
    setErrorMessage(message);
    setErrorDialogOpen(true);
    onClose && setOnCloseAction(onClose);
  };

  const closeErrorDialog = () => {
    onCloseAction && onCloseAction();
    setErrorDialogOpen(false);
    setErrorMessage("");
    setOnCloseAction(() => () => {});
  };

  const value: ErrorDialogContextType = {
    openErrorDialog,
  };

  return (
    <ErrorDialogContext.Provider value={value}>
      {children}
      <ErrorDialog
        closeErrorDialog={closeErrorDialog}
        errorMessage={errorMessage}
        open={errorDialogOpen}
      />
    </ErrorDialogContext.Provider>
  );
};
