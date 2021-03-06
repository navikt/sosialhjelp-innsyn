import React from "react";

const TrashBin: React.FC<{className?: string}> = ({className}) => {
    return (
        <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={className}
            pointerEvents="none"
        >
            <title>Søppelkasse</title>
            <path
                d="M3.516 3.5h16v20h-16zM7.516.5h8v3h-8zM1.016 3.5h22M7.516 7v12M11.516 7v12M15.516 7v12"
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                fill="none"
            />
        </svg>
    );
};

export default TrashBin;
