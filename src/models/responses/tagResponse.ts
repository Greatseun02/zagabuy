import { BaseResponse } from "@/utilities/types";

export type CreateTagResponse = BaseResponse<null>;

export type UpdateTagResponse = BaseResponse<null>;

export type DeleteTagResponse = BaseResponse<null>;

export type ReadTagResponse = BaseResponse<
    TagsEntity[]
>;

export type TagsEntity = {
  tagCreatedAt: string;
  tagId: number;
  tagName: string;
  tagSlug: string;
  tagStatus: string;
  tagUpdatedAt: string;
};
