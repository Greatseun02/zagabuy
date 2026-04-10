"use client";

import { useRef, useMemo } from "react";
import {
  useLazyReadcategoryQuery,
  useDeletecategoryMutation,
} from "@/services/categoryService";
import {
  BaseDataGrid,
  BaseDataGridProps,
  type BaseDataGridRef,
} from "@/components/ui/datagrid/baseDataGrid";
import { CategoryEntity } from "@/models/responses/categoryResponse";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { Button as BaseButton } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAppModal } from "@/hooks/useAppModal";
import {
  CreateCategoryModal,
  UpdateCategoryModal,
} from "@/components/modals/CategoryModals";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import {
  StatusRenderer,
  type StatusMap,
} from "@/components/ui/datagrid/renderers/statusRenderer";
import { toast } from "sonner";

export default function AdminCategoryContent() {
  const gridRef = useRef<BaseDataGridRef>(null);

  const [fetchCategories] = useLazyReadcategoryQuery();
  const [deleteCategory] = useDeletecategoryMutation();

  const createModal = useAppModal(CreateCategoryModal);
  const updateModal = useAppModal(UpdateCategoryModal);
  const confirmDelete = useAppModal(ConfirmationModal);

  const handleFetchRows: BaseDataGridProps["fetchRows"] = async () => {
    const response = await fetchCategories().unwrap();
    return {
      data: response?.data || [],
    };
  };

  const columns: BaseDataGridProps["columns"] = useMemo(
    () => [
      {
        field: "categoryId",
        headerName: "ID",
      },
      {
        field: "categoryName",
        headerName: "Name",
      },
      {
        field: "categorySlug",
        headerName: "Slug",
      },
      {
        field: "categoryStatus",
        headerName: "Status",
        cellRenderer: StatusRenderer,
        cellRendererParams: {
          statusMap: {
            active: {
              color: "hsl(var(--success))",
              backgroundColor:
                "color-mix(in srgb, hsl(var(--success)) 10%, transparent)",
              label: "Active",
            },
            inactive: {
              color: "hsl(var(--muted-foreground))",
              backgroundColor:
                "color-mix(in srgb, hsl(var(--muted-foreground)) 10%, transparent)",
              label: "Inactive",
            },
          } satisfies StatusMap,
          className: "py-1.5 px-6 text-xs",
        },
      },
      {
        field: "categoryCreatedAt",
        headerName: "Created",
      },
    ],
    [],
  );

  const colActions: BaseDataGridProps["colActions"] = {
    edit: {
      onClick(data, action) {
        const row = data as unknown as CategoryEntity;
        updateModal.show({
          title: `Edit ${row.categoryName}`,
          maxWidth: "md",
          category: { ...row },
          onSuccess: () => action?.refresh(),
        });
      },
    },
    delete: {
      onClick(data, actions) {
        const row = data as unknown as CategoryEntity;

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
              actions?.refresh();
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
        <BaseButton
          startIcon={<PlusIcon />}
          className="rounded-sm"
          onClick={() => {
            createModal.show({
              title: "Create New Category",
              maxWidth: "md",
              onSuccess: () => gridRef.current?.actions.refresh(),
            });
          }}
          key="add-category"
        >
          Add Category
        </BaseButton>,
      ]}
    >
      <div className="mt-6">
        <BaseDataGrid
          ref={gridRef}
          fetchRows={handleFetchRows}
          columns={columns}
          uniqueRowId="categoryId"
          autogenerateColumns={false}
          colActions={colActions}
        />
      </div>
    </DashboardPageLayout>
  );
}
