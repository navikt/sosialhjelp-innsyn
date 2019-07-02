import * as React from "react";

const PaperClipSlanted: React.FC<{className?: string}> = ({className}) => {
    return (
        <svg contentScriptType='text/ecmascript' width='24' viewBox='0 0 24 24' className={className}
             height='24' xmlns='http://www.w3.org/2000/svg' version='1'>
            <path strokeLinecap='round' fill='none' strokeLinejoin='round' d='M7.717 15.202l8.501-8.5c.78-.781 2.047-.781 2.828 0 .781.781.78 2.046 0 2.828l-11.483 11.518c-1.562 1.562-4.095 1.562-5.657 0-1.562-1.563-1.562-4.095 0-5.657l12-12c2.148-2.149 5.631-2.149 7.778 0 2.148 2.147 2.148 5.629 0 7.776l-8.5 8.5'
                  stroke='#3e3832' strokeMiterlimit='10' />
        </svg>
    );
};

export default PaperClipSlanted;
