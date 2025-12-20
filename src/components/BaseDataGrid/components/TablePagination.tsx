import { Button } from "@/components/ui/button";
import FormikSelect from "@/components/ui/formik-select";
import { Select } from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

export default function TablePagination({
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}: {
  pageIndex: number;
  pageSize: number;
  onPageChange: (idx: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  return (
    <div className="flex items-center justify-between py-3 border-t px-4">
      <div className="text-sm text-gray-600">Page {pageIndex + 1}</div>
      <div className="flex items-center gap-2">
        <FormikSelect
          value={pageSize}
          onValueChange={(value) => onPageSizeChange(Number(value))}
          options={pageSizeOptions.map((s) => ({
            label: `${s} / page`,
            value: s,
          }))}
        />
        <Button
          onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
          size="medium"
          variant="ghost"
          startIcon={<ArrowLeft />}
        >
          Prev
        </Button>
        <Button
          onClick={() => onPageChange(pageIndex + 1)}
          size="medium"
          variant="ghost"
          endIcon={<ArrowRight />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
