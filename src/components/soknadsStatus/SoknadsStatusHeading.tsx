import {Heading} from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";
import {useTranslation} from "next-i18next";

import {SoknadsStatusResponseStatus} from "../../generated/model";

import SoknadsStatusLenke from "./SoknadsStatusLenke";
import {soknadsStatusTittel} from "./soknadsStatusUtils";

const HeadingWrapper = styled.div`
    margin-bottom: 2rem;
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
        </HeadingWrapper>
    );
};
export default SoknadsStatusHeading;
