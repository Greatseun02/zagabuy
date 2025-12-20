import { BaseResponse } from "@/utilities/types";

export type CreateCategoryResponse = BaseResponse<null>;

export type UpdateCategoryResponse = BaseResponse<null>;

export type DeleteCategoryResponse = BaseResponse<null>;

export type ReadCategoryResponse = BaseResponse<CategoryEntity[]>;

export type CategoryEntity = {
  categoryCreatedAt: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  categoryStatus: string;
  categoryUpdatedAt: string;
};
