import {Heading} from "@navikt/ds-react";
import {soknadsStatusTittel} from "./soknadsStatusUtils";
import SoknadsStatusLenke from "./SoknadsStatusLenke";
import React from "react";
import styled from "styled-components";
import {useTranslation} from "next-i18next";
import {SoknadsStatusResponseStatus} from "../../generated/model";

const HeadingWrapper = styled.div`
    text-align: center;
`;

export const ContentPanelBorder = styled.div<{
    borderspace?: string;
    bordercolor?: string;
}>`
    border-bottom: 2px solid ${(props) => props.bordercolor};
    margin: ${(props) => props.borderspace};
`;

interface Props {
    soknadsStatus?: SoknadsStatusResponseStatus;
}
const SoknadsStatusHeading = (props: Props) => {
    const {t} = useTranslation();

    return (
        <HeadingWrapper>
            <Heading level="2" size="medium" spacing>
                {soknadsStatusTittel(props.soknadsStatus, t)}
            </Heading>
            <SoknadsStatusLenke status={props.soknadsStatus} />
            <ContentPanelBorder borderspace="1rem 0" bordercolor="var(--a-border-divider)" />
        </HeadingWrapper>
    );
};
export default SoknadsStatusHeading;
