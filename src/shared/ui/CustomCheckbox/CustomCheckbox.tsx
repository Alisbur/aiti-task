import type { FC } from "react";

type TCustomCheckboxPropsType = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export const CustomCheckbox: FC<TCustomCheckboxPropsType> = ({
  checked,
  onChange,
  disabled = false,
  className = "",
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  return (
    <div
      className={`relative h-[22px] w-[22px] cursor-pointer rounded-md transition-all duration-200 ${disabled ? "cursor-not-allowed opacity-50" : "hover:opacity-80"} ${
        checked
          ? "bg-checked shadow-sm"
          : "border border-gray-300 bg-white hover:border-gray-400"
      } ${className} `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        disabled={disabled}
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />
    </div>
  );
};
