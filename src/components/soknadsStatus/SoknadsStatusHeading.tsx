import { Heading } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import { SoknadsStatusResponseStatus } from "../../generated/model";

import SoknadsStatusLenke from "./SoknadsStatusLenke";
import { soknadsStatusTittel } from "./soknadsStatusUtils";

const HeadingWrapper = styled.div`
    margin-bottom: 2rem;
    text-align: center;
`;

interface Props {
    soknadsStatus?: SoknadsStatusResponseStatus;
}
const SoknadsStatusHeading = (props: Props) => {
    const t = useTranslations("common");

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
