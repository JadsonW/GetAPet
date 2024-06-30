import { useEffect, useState } from "react";

import styles from "./index.module.css";

interface modalProps {
  children: React.ReactNode;
  visible: boolean;
  title: string;
}

function Modal({ children, visible, title }: modalProps) {
  useEffect(() => {
    if (!visible) return undefined;
  }, [visible]);

  return (
    <div className={`${styles.page}`}>
      <div className={styles.container}>
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default Modal;
