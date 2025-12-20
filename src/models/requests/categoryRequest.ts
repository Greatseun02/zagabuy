export type CreateCategoryRequest = {
  categoryName: string;
  categorySlug: string;
  //   categoryStatus: string;
};

export type UpdateCategoryRequest = {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  //   categoryStatus: string;
};

export type DeleteCategoryRequest = {
  categoryId: number;
};

export const CreateCategoryInit: CreateCategoryRequest = {
  categoryName: "",
  categorySlug: "",
  // categoryStatus: "active",
};

export const UpdateCategoryInit: UpdateCategoryRequest = {
  categoryId: 0,
  categoryName: "",
  categorySlug: "",
  //   categoryStatus: "active",
};
