import { ChangeEvent, useState } from "react";

const useInput = (initialValue: string = '') => {
    const [value, setValue] = useState<string>(initialValue);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    };
    return { value, onChange: handleChange}
}

export default useInput;