import * as yup from "yup";

export const CreateTagValidationSchema = yup.object({
  tagName: yup.string().required(),
  tagSlug: yup.string(),
  tagStatus: yup.string(),
});

export const UpdateTagValidationSchema = yup.object({
  tagId: yup.number().required(),
  tagName: yup.string().required(),
  tagSlug: yup.string(),
  tagStatus: yup.string().required(),
});

export const DeleteTagValidationSchema = yup.object({
  tagId: yup.number().required(),
});
