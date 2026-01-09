"use client";

import { useRef, useMemo } from "react";
import {
  useReadcategoryQuery,
  useDeletecategoryMutation,
} from "@/services/categoryService";
import {
  BaseDataGrid,
  BaseDataGridProps,
  type BaseDataGridRef,
} from "@/components/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryEntity } from "@/models/responses/categoryResponse";
import { UpdateCategoryRequest } from "@/models/requests/categoryRequest";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAppModal } from "@/hooks/useAppModal";
import {
  CreateCategoryModal,
  UpdateCategoryModal,
} from "@/components/modals/CategoryModals";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { toast } from "sonner";
import { StringUtil } from "@/utilities/stringUtil";
import { Badge } from "@/components/ui/badge";

export default function AdminCategoryContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  const {
    data: categoriesResponse,
    refetch,
    isLoading: isLoadingCategories,
  } = useReadcategoryQuery();
  const [deleteCategory] = useDeletecategoryMutation();

  const createModal = useAppModal(CreateCategoryModal);
  const updateModal = useAppModal(UpdateCategoryModal);
  const confirmDelete = useAppModal(ConfirmationModal);

  const columns = useMemo<ColumnDef<CategoryEntity>[]>(
    () => [
      {
        id: "categoryName",
        accessorKey: "categoryName",
        header: "Category Name",
      },
      {
        id: "categorySlug",
        accessorKey: "categorySlug",
        header: "Slug",
      },
      {
        id: "categoryStatus",
        accessorKey: "categoryStatus",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <Badge
              variant={
                status.toLowerCase() === "active"
                  ? "success"
                  : status.toLowerCase() === "inactive"
                  ? "warning"
                  : "default"
              }
            >
              {StringUtil.toTitleCase(status)}
            </Badge>
          );
        },
      },
      {
        id: "categoryCreatedAt",
        accessorKey: "categoryCreatedAt",
        header: "Created",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return date.toLocaleDateString();
        },
      },
    ],
    [updateModal, confirmDelete, deleteCategory, refetch]
  );

  const colActions: BaseDataGridProps["colActions"] = {
    edit: {
      onClick(row) {
        updateModal.show({
          title: `Edit ${row.categoryName}`,
          maxWidth: "md",
          category: { ...row },
          onSuccess: () => refetch(),
        });
      },
    },
    delete: {
      onClick(row) {
        confirmDelete.show({
          title: `Delete "${row.categoryName}"?`,
          description:
            "This action cannot be undone. All associated items will be affected.",
          confirmText: "Delete",
          confirmVariant: "destructive",
          onConfirm: async () => {
            try {
              await deleteCategory({
                categoryId: row.categoryId,
              }).unwrap();
              toast.success("Category deleted successfully");
              refetch();
            } catch (error) {
              toast.error("Failed to delete category");
            }
          },
        });
      },
    },
  };

  return (
    <DashboardPageLayout
      title="Categories"
      description="Manage your product categories here."
      actions={[
        <Button
          startIcon={<PlusIcon />}
          className="rounded-sm"
          onClick={() => {
            createModal.show({
              title: "Create New Category",
              maxWidth: "md",
              onSuccess: () => refetch(),
            });
          }}
          key="add-category"
        >
          Add Category
        </Button>,
      ]}
    >
      <div className="mt-6">
        <BaseDataGrid<CategoryEntity>
          ref={gridRef}
          data={categoriesResponse?.data || []}
          onRefresh={refetch}
          columns={columns}
          autoGenerateColumns={false}
          rowId="categoryId"
          pageSizeOptions={[10, 25, 50]}
          className="rounded-md border"
          colActions={colActions}
          loading={isLoadingCategories}
        />
      </div>
    </DashboardPageLayout>
  );
}
