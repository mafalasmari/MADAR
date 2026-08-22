"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A minimal, dependency-free dialog (no Radix Dialog in this project's
 * deps) used for the founding-partner forms: portal-rendered, closes on
 * Escape or backdrop click, and returns focus-friendly markup via
 * role="dialog" + aria-modal. Scoped to this one use case rather than a
 * general-purpose primitive.
 */
function subscribeNoop() {
  return () => {};
}
function getClientSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function Modal({ open, onClose, title, closeLabel, children, className }: ModalProps) {
  // SSR-safe "are we in the browser yet" check — true only once mounted on
  // the client, so createPortal(document.body) never runs during server
  // rendering, without a setState-in-effect to get there.
  const mounted = React.useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-100 grid place-items-center bg-madar-navy/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8",
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute end-4 top-4 grid size-8 place-items-center rounded-full text-madar-muted transition-colors hover:bg-madar-sand hover:text-madar-navy"
            >
              <X className="size-4" />
            </button>
            <h2 className="pe-8 text-xl font-bold text-madar-navy">{title}</h2>
            <div className="mt-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
