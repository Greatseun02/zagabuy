"use client";

import { useRef, useMemo } from "react";
import {
  useReadcategoryQuery,
  useDeletecategoryMutation,
} from "@/services/categoryService";
import { BaseDataGrid, type BaseDataGridRef } from "@/components/BaseDataGrid";
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

export default function AdminCategoryContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  const { data: categoriesResponse, refetch } = useReadcategoryQuery();
  const [deleteCategory] = useDeletecategoryMutation();

  const createModal = useAppModal(CreateCategoryModal);
  const updateModal = useAppModal(UpdateCategoryModal);
  const confirmDelete = useAppModal(ConfirmationModal);

  const categories = useMemo(() => {
    return categoriesResponse?.data || [];
  }, [categoriesResponse]);

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
        cell: (info) => (
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            {info.getValue() as string}
          </code>
        ),
      },
      {
        id: "categoryStatus",
        accessorKey: "categoryStatus",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
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
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const category = info.row.original;
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="small"
                onClick={() => {
                  const updateData: UpdateCategoryRequest = {
                    categoryId: category.categoryId,
                    categoryName: category.categoryName,
                    categorySlug: category.categorySlug,
                  };
                  updateModal.show({
                    title: `Edit ${category.categoryName}`,
                    maxWidth: "md",
                    category: updateData,
                    onSuccess: () => refetch(),
                  });
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="small"
                onClick={() => {
                  confirmDelete.show({
                    title: `Delete "${category.categoryName}"?`,
                    description:
                      "This action cannot be undone. All associated items will be affected.",
                    confirmText: "Delete",
                    confirmVariant: "destructive",
                    onConfirm: async () => {
                      try {
                        await deleteCategory({
                          categoryId: category.categoryId,
                        }).unwrap();
                        toast.success("Category deleted successfully");
                        refetch();
                      } catch (error) {
                        toast.error("Failed to delete category");
                      }
                    },
                  });
                }}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [updateModal, confirmDelete, deleteCategory, refetch]
  );

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
          data={categories}
          columns={columns}
          autoGenerateColumns={false}
          rowId="categoryId"
          pageSizeOptions={[10, 25, 50]}
          className="rounded-md border"
        />
      </div>
    </DashboardPageLayout>
  );
}
