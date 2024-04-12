import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const WebSocketContext = createContext<WebSocket | null>(null);

type WebSocketProviderProps = {
  children: ReactNode;
};

const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  //const [socket, setSocket] = useState<WebSocket | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const auth = useAuthHeader();

  useEffect(() => {
    let ws: WebSocket | null = new WebSocket(
      `ws://localhost:8000/chat?token=${auth?.split(" ")[1]}`
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
  }, []); // Depends only on auth to avoid unnecessary reconnections

  // Consider rendering a loading state or similar until the WebSocket is connected
  if (!isConnected) {
    return <div>Connecting to WebSocket...</div>;
  }

  // Optionally, handle error states here as well, similar to the previous example

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
