"use client";

import { useSocket } from "@/hooks/useSocket";
import React, { useEffect } from "react";

function OnlineCount() {
  const { socket } = useSocket();
  const [onlineCount, setOnlineCount] = React.useState(0);

  useEffect(() => {
    if (socket) {
      socket.emit("getOnlineCount");
      socket.on("onlineCount", (count: number) => {
        setOnlineCount(count);
      });

      return () => {
        socket.off("onlineCount");
      };
    }
  }, [socket]);

  return (
    <div className="pb-8 text-2xl font-extrabold text-primary">
      Currently Online {"->"} {onlineCount}
    </div>
  );
}

export default OnlineCount;
