export type TDialogStateType = "open" | "closed";

export type TDialogTypeType = "auth" | "addProduct";

export type TDialogCurrentStateType = {
  type: TDialogTypeType;
  state: TDialogStateType;
};
