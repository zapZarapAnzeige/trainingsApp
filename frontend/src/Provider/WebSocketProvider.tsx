import { CircularProgress } from "@mui/joy";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";
import { useAuthHeader } from "react-auth-kit";
import DismissDialog from "../Common/DismissDialog";
import { DismissDialogType } from "../types";

const WebSocketContext = createContext<WebSocket | null>(null);

type WebSocketProviderProps = {
  children: ReactNode;
};

const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>("");
  const auth = useAuthHeader();

  useEffect(() => {
    let ws: WebSocket | null = new WebSocket(
      `ws://localhost:8000/chat?token=${auth().split(" ")[1]}`
    );

    const handleOpen = () => {
      console.log("WebSocket connection established");
      socket.current = ws;
      setIsConnected(true);
    };

    const handleClose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    ws.onopen = handleOpen;
    ws.onclose = handleClose;

    return () => {
      ws?.removeEventListener("open", handleOpen);
      ws?.removeEventListener("close", handleClose);
      if (ws) {
        ws.close();
        ws = null;
      }
    };
  }, []);

  if (error) {
    return (
      <DismissDialog
        closeDismissDialog={() => setError("")}
        dialogContent={error}
        dismissDialogType={DismissDialogType.ERROR}
        open={error !== ""}
      />
    );
  }
  if (!isConnected) {
    return <CircularProgress sx={{ m: "auto" }} />;
  }

  return (
    <WebSocketContext.Provider value={socket.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebsocket = (
  onmessage?: ((this: WebSocket, ev: MessageEvent<any>) => any) | null
) => {
  const socket = useContext(WebSocketContext);

  if (!socket) {
    throw new Error("useWebsocket must be used within a WebSocketProvider");
  }
  if (onmessage) {
    socket.onmessage = onmessage;
  }
  return socket;
};

export { WebSocketProvider, useWebsocket };
