import * as React from 'react';

const DocumentChecklist: React.FC = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 100 100">
            <defs>
                <circle id="abb" cx="50" cy="50" r="50"/>
            </defs>
            <g fill="none" fillRule="evenodd">
                <g>
                    <mask id="bcc" fill="#fff">
                        <use xlinkHref="#abb"/>
                    </mask>
                    <g fill="#FFD399" mask="url(#bcc)">
                        <path d="M0 100h100V0H0z"/>
                    </g>
                </g>
                <path fill="#515658" d="M73.49 16H26.508C24.569 16 23 17.587 23 19.547v59.907a3.56 3.56 0 0 0 1.28 2.735 3.468 3.468 0 0 0 2.228.811H73.49c1.939 0 3.51-1.589 3.51-3.546V19.547C77 17.587 75.429 16 73.49 16"/>
                <path fill="#FFF" d="M29 31.257L39.111 22h28.885a3 3 0 0 1 3 3.004l-.06 48a3 3 0 0 1-3 2.996H32a3 3 0 0 1-3-3V31.257z"/>
                <path fill="#C9C9C9" d="M39.111 22v6.447c0 1.552-1.3 2.81-2.905 2.81H29L39.111 22z"/>
                <g>
                    <path fill="#A59D96" d="M42 44h23v-2H42zM42 51h23v-2H42zM42 57h23v-2H42zM42 64h23v-2H42zM40 40.005h-5v5h5v-5zm-3.942 3.907h2.884v-2.815h-2.884v2.815zM40 46.836h-5v5h5v-5zm-3.942 3.908h2.884v-2.815h-2.884v2.815zM40 53.668h-5v5h5v-5zm-3.942 3.907h2.884V54.76h-2.884v2.815zM40 60.5h-5v5h5v-5zm-3.942 3.908h2.884v-2.815h-2.884v2.815z"/>
                    <path fill="#2F3237" fillRule="nonzero" d="M36.543 41.77L38.765 38 40 39.258 36.616 45 34 41.068l1.176-1.352zM38.516 44L40 45.098 36.646 51 34 46.878l1.427-1.193 1.13 1.761z"/>
                </g>
            </g>
        </svg>

    )
};

export default DocumentChecklist;