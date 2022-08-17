import React from "react";
import styled from "styled-components/macro";
import {SakspanelMaxBreakpoint} from "../../styles/constants";

const StyledSvg = styled.svg`
    height: 20px;
    width: 18px;
    margin-left: 12px;
    margin-right: 18px;

    @media screen and (max-width: ${SakspanelMaxBreakpoint}) {
        margin-right: 10px;
    }
`;
const DocumentIcon: React.FC<{className?: string}> = ({className}) => {
    return (
        <StyledSvg
            xmlns="http://www.w3.org/2000/svg"
            contentScriptType="text/ecmascript"
            version="1"
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
            pointerEvents="none"
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
        </StyledSvg>
    );
};

export default DocumentIcon;
