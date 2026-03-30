import { useCallback, useEffect, useRef } from "react";

import { useToastsStore } from "@/store/toastsStore";

import { type TToastItemType } from "../types/toast.type";

const DEFAULT_TOAST_LIVE_TIME = 5000;

export const useToasts = (toastLiveTime: number = DEFAULT_TOAST_LIVE_TIME) => {
  const { toasts, pushToast, clearToasts, removeToast, popToast } =
    useToastsStore();
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const addToast = useCallback(
    (toast: Omit<TToastItemType, "id">) => {
      const id = Date.now().toString();
      pushToast({ ...toast, id });
      const timer = setTimeout(() => {
        removeToast(id);
        timersRef.current.delete(id);
      }, toastLiveTime);
      timersRef.current.set(id, timer);
    },
    [pushToast, removeToast, toastLiveTime]
  );

  const removeToastWithTimer = useCallback(
    (id: string | string[]) => {
      const ids = Array.isArray(id) ? id : [id];
      ids.forEach((toastId) => {
        const timer = timersRef.current.get(toastId);
        if (timer) {
          clearTimeout(timer);
          timersRef.current.delete(toastId);
        }
      });
      removeToast(id);
    },
    [removeToast]
  );

  useEffect(() => {
    clearToasts();

    return () => {
      clearAllTimers();
    };
  }, [clearToasts, clearAllTimers]);

  return {
    toasts,
    addToast,
    clearToasts,
    removeToast: removeToastWithTimer,
    popToast,
  };
};
