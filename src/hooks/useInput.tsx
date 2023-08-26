import { ChangeEvent, useState, FocusEvent } from "react";

const useInput = (initialValue: string = "") => {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string>("");

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
    const newValue = event.target.value; // To avoid setter function conflicts when updating values
    setValue(newValue);
    validateInput(newValue, event.target.name);
  };

  const validateInput = (value: string, name: string) => {
    if (value.trim() === "") {
      setError("This field is required");
    } else if (name === "password") {
      if (value.length < 6) {
        setError("This field must have at least 6 characters");
      } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
        setError(
          "Password must contain at least one uppercase letter, one number, and one symbol"
        );
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  return {
    value,
    isActive,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    error: error,
  };
};

export default useInput;
