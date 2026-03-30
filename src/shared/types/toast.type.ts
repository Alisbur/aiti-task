export type TToastColorType = "error" | "success" | "warning" | "info";

export type TToastItemType = {
  id: string;
  message: string;
  type: TToastColorType;
  onDismiss?: () => void;
};
