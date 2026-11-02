"use client";

import { useEffect, useState } from "react";
import { getNotificationSocket } from "@/lib/socket";
import type { NotificationItem } from "@/types/api";

export function useNotifications(token: string | null) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!token) return;

    const socket = getNotificationSocket(token);
    const onNotification = (notification: NotificationItem) => {
      setNotifications((current) => [notification, ...current]);
    };

    socket.on("notification", onNotification);
    socket.connect();
    return () => {
      socket.off("notification", onNotification);
      socket.disconnect();
    };
  }, [token]);

  return notifications;
}
