import type { FC } from "react";

type TCustomLoaderPropsType = {
  isLoading: boolean;
  loadingProgress: number;
};

export const CustomLoader: FC<TCustomLoaderPropsType> = ({
  isLoading,
  loadingProgress,
}) => {
  return (
    <div className="w-full">
      <div
        className="h-2 bg-indigo-600 transition-all"
        style={{
          width: `${loadingProgress}%`,
          opacity: isLoading ? 1 : 0,
        }}
      />
    </div>
  );
};
