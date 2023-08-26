import { ChangeEvent, useState, FocusEvent } from "react";

const useInput = (initialValue: string = "") => {
  const [value, setValue] = useState<string>(initialValue);

  const [isActive, setIsActive] = useState(false);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setIsActive(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return {
    value,
    isActive,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
};

export default useInput;
