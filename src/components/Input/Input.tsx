import { ChangeEvent, useState } from "react";
import "./Input.scss";

type InputProps = {
  name: string;
  label: string;
  type: string;
  isActive: boolean;
};

export const Input: React.FC<InputProps> = ({ name, label, type, isActive, ...otherInputs }) => {
  return (
    <div className="input__container">
      <label  className={`input__label ${isActive ? 'active-label' : ''}`} htmlFor={name}>{label}</label>
      <input  className="input__item" id={name} name={name} type={type} autoComplete="off" autoFocus={name === "username"} {...otherInputs}/>
    </div>
  );
};
