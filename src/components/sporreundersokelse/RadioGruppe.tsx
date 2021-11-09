import {Radio, RadioGroup} from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";

const MOBILE_WIDTH = "500px";

const ZebraContainer = styled.div<{zebra?: boolean}>`
    background-color: ${(props) => (props.zebra ? "#f1f1f1" : "inherit")};
    padding: 1rem 1rem 0.5rem 1rem;

    @media screen and (max-width: ${MOBILE_WIDTH}) {
        margin: 0 -1rem;
    }
`;

const RadioFlex = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-items: center;
    gap: 0.75rem;
    row-gap: 0rem;
`;

const StyledRadio = styled(Radio)`
    width: 45px;
    margin: 0px auto;

    .navds-radio__label {
        flex-direction: column-reverse;
        align-items: center;
        width: 100%;
        text-align: center;
    }

    @media screen and (max-width: ${MOBILE_WIDTH}) {
        margin: 0;
    }
`;

const IkkeSvareRadio = styled(StyledRadio)`
    width: 100px;

    @media screen and (max-width: ${MOBILE_WIDTH}) {
        width: 100%;
        .navds-radio__label {
            flex-direction: row;
        }
    }
`;

const VerticalLine = styled.div`
    border-left: 1px solid #c9c9c9;
    align-self: stretch;
    margin: 0.5rem 0;

    @media screen and (max-width: ${MOBILE_WIDTH}) {
        border-top: 1px solid #c9c9c9;
        border-left: 0px;
        width: 100%;
    }
`;

export const RadioGruppe = (props: {zebra?: boolean; legend: string; onChange(value: string): void}) => {
    return (
        <ZebraContainer zebra={props.zebra}>
            <RadioGroup legend={props.legend} onChange={(value) => props.onChange(value)}>
                <RadioFlex>
                    <StyledRadio value="1">Veldig uenig</StyledRadio>
                    <StyledRadio value="2">Uenig</StyledRadio>
                    <StyledRadio value="3">Nøytral</StyledRadio>
                    <StyledRadio value="4">Enig</StyledRadio>
                    <StyledRadio value="5">Veldig enig</StyledRadio>
                    <VerticalLine />
                    <IkkeSvareRadio value="ikke_svare">Ønsker å ikke svare</IkkeSvareRadio>
                </RadioFlex>
            </RadioGroup>
        </ZebraContainer>
    );
};
