import React from "react";

const DocumentIcon: React.FC<{className?: string}> = ({className}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            contentScriptType="text/ecmascript"
            version="1"
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
        >
            <title>Dokument</title>
            <path
                fill="none"
                stroke="#3e3832"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                d="M20.5 23.5h-17V.5h11l6 6zm-6-23v6h6m-13 1H12m-4.5 3h9m-9 3h9m-9 3h9m-9 3h9"
            />
        </svg>
    );
};

export default DocumentIcon;
