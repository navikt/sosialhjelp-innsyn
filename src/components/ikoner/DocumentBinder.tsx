import React from "react";

const DokumentBinder: React.FC<{className?: string}> = ({className}) => {
    return (
        <svg
            className={className}
            width="100"
            height="100"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            pointerEvents="none"
        >
            <title>Vedlegg</title>
            <defs>
                <circle id="binders_path-1" cx="50" cy="50" r="50" />
                <path
                    d="M21.79975,2.758 C20.66675,1.624 19.15975,1 17.55775,1 C15.95475,1 14.44775,1.625 13.31475,2.758 L1.31475,14.758 C-0.43825,16.512 -0.43825,19.367 1.31475,21.122 C2.19175,21.999 3.34475,22.437 4.49675,22.437 C5.64875,22.437 6.80175,21.998 7.67975,21.121 L19.16175,9.602 C20.13575,8.626 20.13575,7.041 19.16175,6.067 C18.21775,5.123 16.56975,5.123 15.62675,6.067 L7.12575,14.567 C6.93075,14.762 6.93075,15.079 7.12575,15.274 C7.32075,15.469 7.63775,15.469 7.83275,15.274 L16.33375,6.774 C16.89875,6.207 17.88775,6.208 18.45475,6.774 C19.03875,7.358 19.03875,8.31 18.45475,8.895 L6.97175,20.414 C5.60775,21.779 3.38775,21.779 2.02175,20.414 C0.65775,19.049 0.65775,16.829 2.02175,15.464 L14.02175,3.464 C14.96675,2.519 16.22275,1.999 17.55775,1.999 C18.89275,1.999 20.14875,2.52 21.09275,3.464 C22.03775,4.408 22.55775,5.664 22.55775,6.999 C22.55775,8.334 22.03775,9.59 21.09275,10.534 L12.59275,19.034 C12.39775,19.229 12.39775,19.546 12.59275,19.741 C12.78775,19.936 13.10475,19.936 13.29975,19.741 L21.79975,11.241 C22.93275,10.108 23.55775,8.602 23.55775,6.999 C23.55775,5.397 22.93275,3.89 21.79975,2.758 Z"
                    id="binders_path-3"
                />
            </defs>
            <g id="Innsyn-v-1.2" fill="none" fillRule="evenodd">
                <g id="Illustrasjoner" transform="translate(-115 -3082)">
                    <g id="Group-11" transform="translate(115 3082)">
                        <g id="spotlight/-element">
                            <g id="-80/-Blå">
                                <mask id="innsyn-mask-2" fill="#fff">
                                    <use xlinkHref="#binders_path-1" />
                                </mask>
                                <g id="V⚙️/STYLING/farge/Oransje/--60" mask="url(#innsyn-mask-2)" fill="#FFD399">
                                    <polygon id="Fill-7" points="0 100 100 100 100 0 0 0" />
                                </g>
                            </g>
                        </g>
                        <g id="Group-10" transform="translate(29 23)">
                            <path
                                d="M0,9.25714286 L10.1111111,0 L38.9962251,0 C40.6530793,4.11038738e-15 41.9962251,1.34314575 41.9962251,3 C41.9962251,3.00125751 41.9962243,3.00251503 41.9962227,3.00377254 L41.935862,51.0037725 C41.9337803,52.6591524 40.5912455,54 38.9358643,54 L3,54 C1.34314575,54 2.02906125e-16,52.6568542 0,51 L0,9.25714286 Z"
                                id="binders_path-3"
                                fill="#FFF"
                            />
                            <path
                                d="M10.1111111,0 L10.1111111,6.44706632 C10.1111111,7.99931419 8.81060709,9.25714286 7.20569486,9.25714286 L0,9.25714286 L10.1111111,0 Z"
                                id="Fill-59"
                                fill="#C9C9C9"
                            />
                        </g>
                        <g id="LINE/edition/-paperclip-1" transform="translate(38 38)">
                            <mask id="mask-4" fill="#fff">
                                <use xlinkHref="#binders_path-3" />
                            </mask>
                            <use id="Mask" fill="#3E3832" fillRule="nonzero" xlinkHref="#binders_path-3" />
                            <g id="↪︎-🌈" mask="url(#mask-4)" fill="#3E3832">
                                <rect
                                    width="24"
                                    height="24"
                                    transform="matrix(1 0 0 -1 0 24)"
                                    id="iconfarge-/-nav-grå"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export default DokumentBinder;
