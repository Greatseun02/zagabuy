"use client";

import { useRef, useMemo } from "react";
import { useReadTagsQuery, useDeleteTagsMutation } from "@/services/tagService";
import { BaseDataGrid, type BaseDataGridRef } from "@/components/BaseDataGrid";
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

export default function AdminTagsContent() {
  const gridRef = useRef<BaseDataGridRef>(null);
  const { data: tagsResponse, refetch } = useReadTagsQuery();
  const [deleteTag] = useDeleteTagsMutation();

  const createModal = useAppModal(CreateTagModal);
  const updateModal = useAppModal(UpdateTagModal);
  const confirmDelete = useAppModal(ConfirmationModal);

  const tags = useMemo(() => {
    return tagsResponse?.data || [];
  }, [tagsResponse]);

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
        cell: (info) => (
          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
            {info.getValue() as string}
          </code>
        ),
      },
      {
        id: "tagStatus",
        accessorKey: "tagStatus",
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
        id: "tagCreatedAt",
        accessorKey: "tagCreatedAt",
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
          const tag = info.row.original;
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="small"
                onClick={() => {
                  const updateData: UpdateTagRequest = {
                    tagId: tag.tagId,
                    tagName: tag.tagName,
                    tagSlug: tag.tagSlug,
                  };
                  updateModal.show({
                    title: `Edit ${tag.tagName}`,
                    maxWidth: "md",
                    tag: updateData,
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
                    title: `Delete "${tag.tagName}"?`,
                    description:
                      "This action cannot be undone. All associated items will be affected.",
                    confirmText: "Delete",
                    confirmVariant: "destructive",
                    onConfirm: async () => {
                      try {
                        await deleteTag({
                          tagId: tag.tagId,
                        }).unwrap();
                        toast.success("Tag deleted successfully");
                        refetch();
                      } catch (error) {
                        toast.error("Failed to delete tag");
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
    [updateModal, confirmDelete, deleteTag, refetch]
  );

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
          data={tags}
          columns={columns}
          autoGenerateColumns={false}
          rowId="tagId"
          pageSizeOptions={[10, 25, 50]}
        />
      </div>
    </DashboardPageLayout>
  );
}
