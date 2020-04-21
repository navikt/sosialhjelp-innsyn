import React from "react";

const Coins: React.FC = () => {
    return (
        <svg width="24" viewBox="0 0 24 24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" strokeMiterlimit="10" stroke="#3e3832" strokeLinejoin="round">
                <path d="M.5 13.5h4v8.042h-4z" />
                <path
                    strokeLinecap="round"
                    d="M4.5 20c10.5 3.5 7 3.5 19-2.5-1.063-1.062-1.902-1.313-3-1l-4.434 1.471M4.5 14.5h3c2.353 0 4 1.5 4.5 2h3c1.594 0 1.594 2 0 2h-5.5"
                />
                <circle r="3" cx="17.5" cy="3.5" strokeLinecap="round" />
                <circle r="3" cx="12.5" cy="10.5" strokeLinecap="round" />
                <path strokeLinecap="round" d="M12.5 9.5v2M17.5 2.5v2" />
            </g>
        </svg>
    );
};

export default Coins;
