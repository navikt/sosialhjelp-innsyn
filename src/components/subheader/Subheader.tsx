import React from "react";
import styles from "./subheader.module.css";

const Subheader: React.FC<{children: React.ReactNode; className?: string}> = ({children, className}) => {
    return <div className={`${styles.informasjonstavle__subheader} ${className}`}>{children}</div>;
};

export default Subheader;
