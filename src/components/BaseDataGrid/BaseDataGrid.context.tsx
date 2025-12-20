import React from "react";
import type { BaseDataGridRef } from "./BaseDataGrid.types";

export const BaseDataGridContext = React.createContext<BaseDataGridRef | null>(
  null
);

export const BaseDataGridProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: BaseDataGridRef;
}) => (
  <BaseDataGridContext.Provider value={value}>
    {children}
  </BaseDataGridContext.Provider>
);

export const useBaseDataGridContext = () => {
  const context = React.useContext(BaseDataGridContext);
  if (!context) {
    throw new Error(
      "useBaseDataGridContext must be used within BaseDataGridProvider"
    );
  }
  return context;
};
