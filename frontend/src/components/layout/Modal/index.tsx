import { useEffect, useState } from "react";

import styles from "./index.module.css";

interface modalProps {
  children: React.ReactNode;
  visible: boolean;
}

function Modal({ children, visible }: modalProps) {
  useEffect(() => {
    if (!visible) return undefined;
  }, [visible]);

  return (
    <div className={`${styles.page}`}>
      <div className={styles.container}>
        <h1>Editar</h1>
        {children}
      </div>
    </div>
  );
}

export default Modal;
