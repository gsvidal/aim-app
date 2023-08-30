import { useEffect, useState } from "react";

import "./Toast.scss";

type ToastProps = {
  children: string;
};

export const Toast: React.FC<ToastProps> = ({ children }) => {
  const [visible, setVisible] = useState(true);
  const [type, setType] = useState<string>("");

  useEffect(() => {
    if (children.toLowerCase().includes("logged out")) {
      setType("logout");
    } else if (children.toLowerCase().includes("logged in")) {
      setType("login");
    } else if (children.toLowerCase().includes("registered")) {
      setType("register");
    }
    setVisible(true);
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [children]);

  return (
    <div className={`toast ${visible ? "visible" : ""} toast--${type}`}>
      <p>{children}</p>
    </div>
  );
};
