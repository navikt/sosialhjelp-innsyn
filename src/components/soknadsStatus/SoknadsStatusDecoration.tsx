import React from "react";
import styled from "styled-components/macro";
import {PlaceFilled} from "@navikt/ds-icons";

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

const SpotIcon = styled(PlaceFilled).attrs({
    title: "spot",
})`
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    height: 1.5rem;
    width: 1.5rem;
`;

const SoknadsStatusDecoration = () => {
    return (
        <Circle>
            <SpotIcon aria-hidden />
        </Circle>
    );
};
export default SoknadsStatusDecoration;
