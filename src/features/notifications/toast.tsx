"use client";

import { AlertCircle, CircleCheckBig, X } from "lucide-react";
import { Toaster, toast, type Toast } from "react-hot-toast";

export type AppNoticeTone = "success" | "warning";

const TOAST_DURATION_MS = 3000;

const toneStyles: Record<
  AppNoticeTone,
  {
    cardBorder: string;
    iconWrap: string;
    iconColor: string;
  }
> = {
  success: {
    cardBorder: "border-emerald-300/40",
    iconWrap: "bg-emerald-500/14",
    iconColor: "text-emerald-700",
  },
  warning: {
    cardBorder: "border-[#f2b07a]/40",
    iconWrap: "bg-[#f2b07a]/18",
    iconColor: "text-[#b45309]",
  },
};

function NotificationToast({
  message,
  toastRef,
  tone,
}: {
  message: string;
  toastRef: Toast;
  tone: AppNoticeTone;
}) {
  const styles = toneStyles[tone];
  const Icon = tone === "success" ? CircleCheckBig : AlertCircle;

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm rounded-[28px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,247,251,0.94))] p-3 text-sm font-medium text-slate-700 shadow-[0_28px_65px_-34px_rgba(15,23,42,0.52)] backdrop-blur-xl transition-all duration-200 ${
        styles.cardBorder
      } ${
        toastRef.visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${styles.iconWrap}`}
        >
          <Icon className={`h-4 w-4 ${styles.iconColor}`} strokeWidth={2.2} />
        </span>
        <span className="min-w-0 flex-1 leading-5">{message}</span>
        <button
          type="button"
          onClick={() => toast.dismiss(toastRef.id)}
          aria-label="Cerrar notificacion"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-600"
        >
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ top: 20, left: 16, right: 16 }}
      toastOptions={{ duration: TOAST_DURATION_MS }}
    />
  );
}

export function showAppToast(message: string, tone: AppNoticeTone = "success") {
  return toast.custom(
    (toastRef) => (
      <NotificationToast
        message={message}
        toastRef={toastRef}
        tone={tone}
      />
    ),
    { duration: TOAST_DURATION_MS },
  );
}

export function showSuccessToast(message: string) {
  return showAppToast(message, "success");
}

export function showWarningToast(message: string) {
  return showAppToast(message, "warning");
}
