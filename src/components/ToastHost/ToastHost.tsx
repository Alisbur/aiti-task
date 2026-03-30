import { useEffect } from "react";

import { useToasts } from "@/shared/hooks/useToasts";
import type { TToastColorType } from "@/shared/types/toast.type";

const TOAST_BG_CONFIG: Record<TToastColorType, string> = {
  info: "bg-blue-500",
  error: "bg-red-500",
  success: "bg-green-500",
  warning: "bg-orange-500",
};

export const ToastHost = () => {
  const toast = useToasts();

  useEffect(() => {
    const timers = toast.toasts.map((t) =>
      window.setTimeout(() => t.onDismiss?.(), 5000)
    );
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [toast.toasts]);

  return (
    <div className="pointer-events-none fixed left-4 top-8 z-50 flex w-full max-w-sm flex-col gap-2">
      {toast.toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm ${TOAST_BG_CONFIG[t.type]}`}
          role="status"
          aria-live="polite"
        >
          <p className="text-white">{t.message}</p>
        </div>
      ))}
    </div>
  );
};
