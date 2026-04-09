"use client";

import React from "react";
import { Button as BaseButton } from "@/components/ui/button";
import Typography from "@/components/ui/typography";

export type BaseTablePaginationPanelProps = {
  currentPage: number; // 0-based
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage?: (pageNo: number) => void; // optional if you want page buttons
  isZeroBasedIndex?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const BaseTablePaginationPanel: React.FC<BaseTablePaginationPanelProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage,
  ...divProps
}) => {
  // Always display 1-based page numbers to users
  const displayCurrentPage = currentPage + 1;
  const displayTotalPages = totalPages;

  // Generate page buttons if onGoToPage is provided
  const renderPageButtons = () => {
    if (!onGoToPage || totalPages <= 1) return null;

    const buttons = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <BaseButton
          key={i}
          onClick={() => onGoToPage(i)}
          text={(i + 1).toString()}
          variant={i === currentPage ? "primary" : "secondary"}
          size="small"
          style={{ minWidth: "36px" }}
        />,
      );
    }

    return <div className="flex gap-2">{buttons}</div>;
  };

  return (
    <div
      {...divProps}
      className="flex justify-between items-center gap-4 p-5 py-2"
      style={{
        ...divProps.style,
      }}
    >
      <Typography size="sm">
        Page {displayCurrentPage} of {displayTotalPages}
      </Typography>

      <div className="flex items-center gap-4">
        {renderPageButtons()}

        <BaseButton
          onClick={onPrevPage}
          text="Previous"
          variant="secondary"
          size="small"
          disabled={currentPage === 0}
        />

        <BaseButton
          onClick={onNextPage}
          text="Next"
          variant="secondary"
          size="small"
          disabled={currentPage >= totalPages - 1 || totalPages === 0}
        />
      </div>
    </div>
  );
};

export default BaseTablePaginationPanel;
