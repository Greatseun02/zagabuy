import { Button as BaseButton } from "@/components/ui/button";
import FormikSelect from "@/components/ui/formik-select";
import { Select } from "@/components/ui/select";
import Typography from "@/components/ui/typography";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function TablePagination({
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  totalItems = 0,
}: {
  pageIndex: number;
  pageSize: number;
  onPageChange: (idx: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  totalItems?: number;
}) {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex < totalPages - 1;

  return (
    <div className="flex items-center justify-between py-3 border-t px-4">
      <Typography size="sm" color="muted-foreground">
        Page {pageIndex + 1} of {totalPages}
      </Typography>
      <Typography size="sm" color="muted-foreground">
        {totalItems} total items
      </Typography>
      <div className="flex items-center gap-2">
        <FormikSelect
          value={pageSize}
          onValueChange={(value) => onPageSizeChange(Number(value))}
          options={pageSizeOptions.map((s) => ({
            label: `${s} / page`,
            value: s,
          }))}
        />
        <BaseButton
          onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
          size="medium"
          variant="ghost"
          startIcon={<ArrowLeft />}
          disabled={!canGoPrev}
        >
          Prev
        </BaseButton>
        <BaseButton
          onClick={() => onPageChange(pageIndex + 1)}
          size="medium"
          variant="ghost"
          endIcon={<ArrowRight />}
          disabled={!canGoNext}
        >
          Next
        </BaseButton>
      </div>
    </div>
  );
}
