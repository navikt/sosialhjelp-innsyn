import React from "react";

const UploadFile: React.FC<{className?: string; onClick?: (event: any) => void}> = ({className, onClick}) => {
    return (
        <span onClick={onClick}>
            <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25">
                <path
                    d="M23 19v2c0 1.656-1.285 3-2.869 3H3.869C2.284 24 1 22.656 1 21v-2M12 1v17M5 8l7-7 7 7"
                    fill="none"
                    fillRule="evenodd"
                    stroke="#0067C5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
};

export default UploadFile;
