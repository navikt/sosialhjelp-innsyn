import React from "react";

import styles from "./errorMessageWrapper.module.css";

interface ErrorMessageProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

const ErrorMessageWrapper = ({children}: ErrorMessageProps) => (
    <div className={styles.error_placeholder} aria-live="assertive" aria-atomic="true">
        {children}
    </div>
);
export default ErrorMessageWrapper;
