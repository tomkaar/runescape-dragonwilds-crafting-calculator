"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

type ModalContextType = {
  dismiss: () => void;
};

const ModalContext = createContext<ModalContextType>({
  dismiss: () => {},
});

export const useModal = () => useContext(ModalContext);

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <div className="modal-backdrop">
      <ModalContext.Provider value={{ dismiss: onDismiss }}>
        <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
          {children}
        </dialog>
      </ModalContext.Provider>
    </div>,
    document.getElementById("modal-root")!,
  );
}
