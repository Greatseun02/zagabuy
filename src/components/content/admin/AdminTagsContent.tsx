"use client";

import { useRef, useMemo } from "react";
import {
  useLazyReadTagsQuery,
  useDeleteTagsMutation,
} from "@/services/tagService";
import {
  BaseDataGrid,
  BaseDataGridProps,
  type BaseDataGridRef,
} from "@/components/ui/datagrid/baseDataGrid";
import { TagsEntity } from "@/models/responses/tagResponse";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { Button as BaseButton } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAppModal } from "@/hooks/useAppModal";
import { CreateTagModal, UpdateTagModal } from "@/components/modals/TagModals";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { StatusRenderer, type StatusMap } from "@/components/ui/datagrid/renderers/statusRenderer";
import { toast } from "sonner";

export default function AdminTagsContent() {
  const gridRef = useRef<BaseDataGridRef>(null);

  const [fetchTags] = useLazyReadTagsQuery();
  const [deleteTag] = useDeleteTagsMutation();

  const createModal = useAppModal(CreateTagModal);
  const updateModal = useAppModal(UpdateTagModal);
  const confirmDelete = useAppModal(ConfirmationModal);

  const handleFetchRows: BaseDataGridProps["fetchRows"] = async () => {
    const response = await fetchTags().unwrap();
    return {
      data: response?.data || [],
    };
  };

  const columns: BaseDataGridProps["columns"] = useMemo(
    () => [
      {
        field: "tagId",
        headerName: "ID",
      },
      {
        field: "tagName",
        headerName: "Name",
      },
      {
        field: "tagSlug",
        headerName: "Slug",
      },
      {
        field: "tagStatus",
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
        field: "tagCreatedAt",
        headerName: "Created",
      },
    ],
    [],
  );

  const colActions: BaseDataGridProps["colActions"] = {
    edit: {
      onClick(row, action) {
        updateModal.show({
          title: `Edit ${row.tagName}`,
          maxWidth: "md",
          tag: row as TagsEntity,
          onSuccess: () => action?.refresh(),
        });
      },
    },
    delete: {
      onClick(data, actions) {
        const row = data as unknown as TagsEntity;
        confirmDelete.show({
          title: `Delete "${row.tagName}"?`,
          description:
            "This action cannot be undone. All associated items will be affected.",
          confirmText: "Delete",
          confirmVariant: "destructive",
          onConfirm: async () => {
            try {
              await deleteTag({
                tagId: row.tagId,
              }).unwrap();
              toast.success("Tag deleted successfully");
              actions?.refresh();
            } catch (error) {
              toast.error("Failed to delete tag");
            }
          },
        });
      },
    },
  };

  return (
    <DashboardPageLayout
      title="Tags"
      description="Manage your product tags here."
      actions={[
        <BaseButton
          startIcon={<PlusIcon />}
          className="rounded-sm"
          onClick={() => {
            createModal.show({
              title: "Create New Tag",
              maxWidth: "lg",
              onSuccess: () => gridRef.current?.actions.refresh(),
            });
          }}
          key="add-tag"
        >
          Add Tag
        </BaseButton>,
      ]}
    >
      <div className="mt-6">
        <BaseDataGrid
          ref={gridRef}
          fetchRows={handleFetchRows}
          columns={columns}
          uniqueRowId="tagId"
          autogenerateColumns={false}
          colActions={colActions}
        />
      </div>
    </DashboardPageLayout>
  );
}
