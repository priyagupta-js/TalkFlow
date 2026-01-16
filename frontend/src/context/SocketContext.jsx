import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // No user → no socket
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Create socket ONCE when user becomes available
    const newSocket = io(import.meta.env.VITE_BACKEND_API, {
      withCredentials: true,
      transports: ["websocket"], // optional but stabilizes
    });

    setSocket(newSocket);

    // Cleanup runs ONLY when user changes or component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, [user]); // 🔥 ONLY user here

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
