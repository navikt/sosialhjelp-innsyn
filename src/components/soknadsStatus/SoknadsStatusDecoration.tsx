import React from "react";
import styled from "styled-components";
import {EmailFilled, EmailOpenedFilled, SandglassFilled, SuccessFilled} from "@navikt/ds-icons";
import {SoknadsStatusResponseStatus} from "../../../generated/model";

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

const StyledEmailFilled = styled(EmailFilled)`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    height: 1.5rem;
    width: 1.5rem;
`;

const StyledEmailOpenedFilled = styled(EmailOpenedFilled)`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    height: 1.5rem;
    width: 1.5rem;
`;

const StyledSandglassFilled = styled(SandglassFilled)`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    height: 1.5rem;
    width: 1.5rem;
`;

const StyledSuccessFilled = styled(SuccessFilled)`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    height: 1.5rem;
    width: 1.5rem;
`;

interface Props {
    soknadsStatus?: SoknadsStatusResponseStatus;
}

const SoknadsStatusDecoration = (props: Props) => {
    console.log("props soknadStatus", props.soknadsStatus);

    return (
        <Circle>
            {props.soknadsStatus === "SENDT" && <StyledEmailFilled />}
            {props.soknadsStatus === "MOTTATT" && <StyledEmailOpenedFilled />}
            {props.soknadsStatus === "UNDER_BEHANDLING" && <StyledSandglassFilled />}
            {props.soknadsStatus === "BEHANDLES_IKKE" && <StyledSuccessFilled />}
            {props.soknadsStatus === "FERDIGBEHANDLET" && <StyledSuccessFilled />}
        </Circle>
    );
};
export default SoknadsStatusDecoration;
