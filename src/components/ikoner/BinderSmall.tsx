import * as React from "react";

interface Props {
    putPropsHere?: string;
}

const BinderSmall: React.FC<Props> = (props: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="32"
            height="32"
            viewBox="0 0 32 32"
        >
            <defs>
                <path
                    id="avcx"
                    d="M8 0C3.364 0 0 3.644 0 8.667v16.666C0 29.196 2.524 32 6 32s6-2.804 6-6.667V12.667C12 9.876 10.392 8 8 8s-4 1.876-4 4.667v10a.667.667 0 0 0 1.333 0v-10c0-1.611.7-3.334 2.667-3.334 1.967 0 2.667 1.723 2.667 3.334v12.666c0 3.14-1.919 5.334-4.667 5.334-2.748 0-4.667-2.194-4.667-5.334V8.667c0-4.25 2.804-7.334 6.667-7.334s6.667 3.084 6.667 7.334v12a.667.667 0 0 0 1.333 0v-12C16 3.644 12.635 0 8 0z"
                />
            </defs>
            <g fill="none" fillRule="evenodd" transform="translate(8)">
                <mask id="bvcx" fill="#fff">
                    <use xlinkHref="#avcx" />
                </mask>
                <use fill="#3E3832" fillRule="nonzero" xlinkHref="#avcx" />
                <g fill="#3E3832" mask="url(#bvcx)">
                    <path d="M-8 32h32V0H-8z" />
                </g>
            </g>
        </svg>
    );
};

export default BinderSmall;
