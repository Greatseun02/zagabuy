"use client";

import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type BaseTabItem = {
  /** Unique identifier for the tab */
  id: string;
  /** Label displayed on the tab trigger */
  label: string | ReactNode;
  /** Content to display when tab is active */
  content: ReactNode;
  /** Optional icon to display alongside label */
  icon?: ReactNode;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Additional class names for trigger */
  triggerClassName?: string;
  /** Additional class names for content */
  contentClassName?: string;
};

export type BaseTabProps = {
  /** Array of tab items */
  tabs: BaseTabItem[];
  /** Default active tab id */
  defaultValue?: string;
  /** Additional class names for root Tabs component */
  className?: string;
  /** Additional class names for TabsList */
  listClassName?: string;
  /** Additional class names for TabsContent wrapper */
  contentWrapperClassName?: string;
  /** Callback when active tab changes */
  onValueChange?: (value: string) => void;
};

export default function BaseTab({
  tabs,
  defaultValue,
  className,
  listClassName,
  contentWrapperClassName,
  onValueChange,
}: BaseTabProps) {
  // Use first tab id as default if not specified
  const activeDefault = defaultValue || tabs[0]?.id;

  return (
    <Tabs
      defaultValue={activeDefault}
      onValueChange={onValueChange}
      className={className}
    >
      <TabsList className={listClassName}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className={tab.triggerClassName}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className={cn(contentWrapperClassName, tab.contentClassName)}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
