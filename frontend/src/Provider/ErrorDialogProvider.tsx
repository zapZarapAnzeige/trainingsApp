import { createContext, useContext, useState, ReactNode } from "react";
import DismissDialog from "../Common/DismissDialog";
import { DismissDialogType } from "../types";

type DismissDialogContextType = {
  openDismissDialog: (message: string, onClose?: VoidFunction) => void;
};

const DismissDialogContext = createContext<
  DismissDialogContextType | undefined
>(undefined);

export const useDismissDialog = () => {
  const context = useContext(DismissDialogContext);
  if (!context) {
    throw new Error("No Provider present");
  }
  return context;
};

type DismissDialogProviderProps = {
  children: ReactNode;
};

export const ErrorDialogProvider = ({
  children,
}: DismissDialogProviderProps) => {
  const [DismissDialogOpen, setDismissDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [onCloseAction, setOnCloseAction] = useState<VoidFunction>(() => {});

  const openDismissDialog = (message: string, onClose?: VoidFunction) => {
    setErrorMessage(message);
    setDismissDialogOpen(true);
    onClose && setOnCloseAction(onClose);
  };

  const closeDismissDialog = () => {
    onCloseAction && onCloseAction();
    setDismissDialogOpen(false);
    setErrorMessage("");
    setOnCloseAction(() => () => {});
  };

  const value: DismissDialogContextType = {
    openDismissDialog,
  };

  return (
    <DismissDialogContext.Provider value={value}>
      {children}
      <DismissDialog
        closeDismissDialog={closeDismissDialog}
        dismissDialogType={DismissDialogType.ERROR}
        errorMessage={errorMessage}
        open={DismissDialogOpen}
      />
    </DismissDialogContext.Provider>
  );
};
