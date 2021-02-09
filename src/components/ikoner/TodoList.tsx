import React from "react";

const TodoList: React.FC<{className?: string}> = ({className}) => {
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
            <title>Liste</title>
            <g fill="none" stroke="#000" strokeLinejoin="round" strokeMiterlimit="10">
                <path d="M.5.5h23v23H.5z" />
                <path strokeLinecap="round" d="M3.5 7.5l2 2 5-5m-7 12l2 2 5-5m2-5h8m-8 9h8" />
            </g>
        </svg>
    );
};

export default TodoList;
