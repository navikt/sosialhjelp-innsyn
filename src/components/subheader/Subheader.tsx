import React from "react";

import styles from "./subheader.module.css";

const Subheader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={`${styles.informasjonstavle__subheader} ${className}`}>{children}</div>;
};

export default Subheader;
