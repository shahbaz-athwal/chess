"use client";

import { useSocket } from "@/hooks/useSocket";
import React, { useEffect } from "react";

function OnlineCount() {
  const { socket } = useSocket();
  const [onlineCount, setOnlineCount] = React.useState(0);

  useEffect(() => {
    if (socket) {
      socket.emit("get_online_count");
      socket.on("online_count", (count: number) => {
        setOnlineCount(count);
      });

      return () => {
        socket.off("online_count");
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
