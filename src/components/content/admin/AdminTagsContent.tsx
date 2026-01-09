"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { useReadTagsQuery, useDeleteTagsMutation } from "@/services/tagService";
import {
  BaseDataGrid,
  BaseDataGridProps,
  type BaseDataGridRef,
} from "@/components/BaseDataGrid";
import { ColumnDef } from "@tanstack/react-table";
import { TagsEntity } from "@/models/responses/tagResponse";
import { UpdateTagRequest } from "@/models/requests/tagRequest";
import DashboardPageLayout from "@/components/layouts/DashboardPageLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAppModal } from "@/hooks/useAppModal";
import { CreateTagModal, UpdateTagModal } from "@/components/modals/TagModals";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";
import { toast } from "sonner";
import { TimeUtil } from "@/utilities/timeUtil";
import { Badge } from "@/components/ui/badge";
import { StringUtil } from "@/utilities/stringUtil";

export default function AdminTagsContent() {
  const gridRef = useRef<BaseDataGridRef>(null);

  // External state for RTK Query integration

  const { data: tagsResponse, isLoading, refetch } = useReadTagsQuery();
  const [deleteTag] = useDeleteTagsMutation();

  const createModal = useAppModal(CreateTagModal);
  const updateModal = useAppModal(UpdateTagModal);
  const confirmDelete = useAppModal(ConfirmationModal);

  const columns = useMemo<ColumnDef<TagsEntity>[]>(
    () => [
      {
        id: "tagName",
        accessorKey: "tagName",
        header: "Tag Name",
      },
      {
        id: "tagSlug",
        accessorKey: "tagSlug",
        header: "Slug",
      },
      {
        id: "tagStatus",
        accessorKey: "tagStatus",
        header: "Status",
        cell: (data) => {
          const status = data.getValue() as string;
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
        id: "tagCreatedAt",
        accessorKey: "tagCreatedAt",
        header: "Created",
        cell: (data) => {
          const date = new Date(data.getValue() as string);
          return TimeUtil.timeAgo(date);
        },
      },
    ],
    [updateModal, confirmDelete, deleteTag, refetch]
  );

  const colActions: BaseDataGridProps["colActions"] = {
    edit: {
      onClick(row, actions) {
        updateModal.show({
          title: `Edit ${row.tagName}`,
          maxWidth: "md",
          tag: row as TagsEntity,
          onSuccess: () => actions?.refetch(),
        });
      },
    },
    delete: {
      onClick(row, actions) {
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
              refetch();
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
        <Button
          startIcon={<PlusIcon />}
          className="rounded-sm"
          onClick={() => {
            createModal.show({
              title: "Create New Tag",
              maxWidth: "md",
              onSuccess: () => refetch(),
            });
          }}
          key="add-tag"
        >
          Add Tag
        </Button>,
      ]}
    >
      <div className="mt-6">
        <BaseDataGrid<TagsEntity>
          ref={gridRef}
          data={tagsResponse?.data ?? []}
          columns={columns}
          autoGenerateColumns={false}
          rowId="tagId"
          pageSizeOptions={[10, 25, 50]}
          loading={isLoading}
          onRefresh={() => refetch()}
          colActions={colActions}
          mode="client"
        />
      </div>
    </DashboardPageLayout>
  );
}
