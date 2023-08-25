import { ChangeEvent, useState } from "react";
import "./Input.scss";

type InputProps = {
  name: string;
  label: string;
  type: string;
};

export const Input: React.FC<InputProps> = ({ name, label, type, ...otherInputs }) => {
  return (
    <div className="input-container">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} autoComplete="off" autoFocus={name === "username"} {...otherInputs}/>
    </div>
  );
};
