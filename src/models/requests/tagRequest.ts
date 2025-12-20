export type CreateTagRequest = {
  tagName: string;
  tagSlug: string;
  //   tagStatus: string;
};

export type UpdateTagRequest = {
  tagId: number;
  tagName: string;
  tagSlug: string;
  //   tagStatus: string;
};

export type DeleteTagRequest = {
  tagId: number;
};

export const CreateTagInit: CreateTagRequest = {
  tagName: "",
  tagSlug: "",
  // tagStatus: "active",
};

export const UpdateTagInit: UpdateTagRequest = {
  tagId: 0,
  tagName: "",
  tagSlug: "",
  //   tagStatus: "active",
};
