"use client";

import { Provider } from "react-redux";
import { persistor, store } from "@/configs/storeConfig";
import { PersistGate } from "redux-persist/integration/react";
import NiceModal from "@ebay/nice-modal-react";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export function GlobalModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NiceModal.Provider>{children}</NiceModal.Provider>;
}
