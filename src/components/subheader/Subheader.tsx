import React from "react";
import "./subheader.less";

const Subheader: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => {
    return (
        <div className={"informasjonstavle__subheader " + className}>
            {children}
        </div>
    );
};

export default Subheader;
