import React from "react";
import styled from "styled-components";
import {SoknadsStatusResponseStatus} from "../../../generated/model";
import AapnetBrev from "../ikoner/AapnetBrev";
import GodkjentMerke from "../ikoner/GodkjentMerke";
import Timeglass from "../ikoner/Timeglass";
import Dokument from "../ikoner/Dokument";
import LukketBrev from "../ikoner/LukketBrev";

const Circle = styled.div`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 0;
    left: 50%;
    background: var(--a-surface-success-subtle);
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
`;

const StyledLukketBrev = styled.div`
    position: absolute;
    top: 30%;
    left: 20%;
`;

const StyledAApnetBrev = styled.div`
    position: absolute;
    top: 15%;
    left: 20%;
`;

const StyledDokument = styled.div`
    position: absolute;
    top: 23%;
    left: 25%;
`;

const StyledTimeglass = styled.div`
    position: absolute;
    top: 16%;
    left: 82%;
`;

const StyledGodkjentMerke = styled.div`
    position: absolute;
    top: 50%;
    left: 60%;
`;

interface Props {
    soknadsStatus?: SoknadsStatusResponseStatus;
}

const SoknadsStatusDecoration = (props: Props) => {
    return (
        <Circle>
            {props.soknadsStatus === "SENDT" && (
                <StyledLukketBrev>
                    <LukketBrev />
                </StyledLukketBrev>
            )}
            {props.soknadsStatus === "MOTTATT" && (
                <StyledAApnetBrev>
                    <AapnetBrev />
                </StyledAApnetBrev>
            )}
            {props.soknadsStatus === "UNDER_BEHANDLING" && (
                <StyledDokument>
                    <Dokument />
                    <StyledTimeglass>
                        <Timeglass />
                    </StyledTimeglass>
                </StyledDokument>
            )}
            {props.soknadsStatus === "BEHANDLES_IKKE" && (
                <StyledDokument>
                    <Dokument />
                    <StyledGodkjentMerke>
                        <GodkjentMerke />
                    </StyledGodkjentMerke>
                </StyledDokument>
            )}
            {props.soknadsStatus === "FERDIGBEHANDLET" && (
                <StyledDokument>
                    <Dokument />
                    <StyledGodkjentMerke>
                        <GodkjentMerke />
                    </StyledGodkjentMerke>
                </StyledDokument>
            )}
        </Circle>
    );
};
export default SoknadsStatusDecoration;
