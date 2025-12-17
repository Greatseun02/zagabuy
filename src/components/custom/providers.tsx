"use client";

import { Provider } from "react-redux";
import { persistor, store } from "@/configs/storeConfig";
import { PersistGate } from "redux-persist/integration/react";
import NiceModal from "@ebay/nice-modal-react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { themesEnum } from "@/utilities/enums/themesEnum";
import { Toaster } from "sonner";

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={[themesEnum.light, themesEnum.dark]}
    >
      {children}
    </NextThemeProvider>
  );
}

export function ToastProvider() {
  return (
    <Toaster
      richColors={true}
      position="top-right"
      closeButton={true}
      expand={true}
    ></Toaster>
  );
}
