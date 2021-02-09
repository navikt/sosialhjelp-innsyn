import * as React from "react";

interface Props {
    putPropsHere?: string;
}

const ChecklistSmall: React.FC<Props> = (props: Props) => {
    return (
        <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            pointerEvents="none"
        >
            <title>Liste</title>
            <g fill="none" fillRule="evenodd" stroke="#000" strokeLinejoin="round">
                <path d="M23.5 23.5H.5V.5h23z" />
                <path strokeLinecap="round" d="M3.5 7.5l2 2 5-5M3.5 16.5l2 2 5-5M12.5 8.5h8M12.5 17.5h8" />
            </g>
        </svg>
    );
};

export default ChecklistSmall;
