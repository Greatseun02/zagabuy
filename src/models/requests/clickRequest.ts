export type CreateClickRequest = {
  clickEventDealId: number;
  //   clickEventHash: string;
  //   clickEventIp: string;
  //   clickEventStatus: string;
};

export type UpdateClickRequest = {
  clickEventDealId: number;
  //   clickEventHash: string;
  clickEventId: number;
  //   clickEventIp: string;
  //   clickEventStatus: string;
};

export type DeleteClickRequest = {
  clickEventId: number;
};

export const CreateClickInit: CreateClickRequest = {
  clickEventDealId: 0,
  //   clickEventHash: "",
  //   clickEventIp: "",
  //   clickEventStatus: "",
};

export const UpdateClickInit: UpdateClickRequest = {
  clickEventDealId: 0,
  //   clickEventHash: "",
  clickEventId: 0,
  //   clickEventIp: "",
  //   clickEventStatus: "",
};

export const DeleteClickInit: DeleteClickRequest = {
  clickEventId: 0,
};
