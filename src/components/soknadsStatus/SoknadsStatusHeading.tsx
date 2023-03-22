import {Heading} from "@navikt/ds-react";
import {soknadsStatusTittel} from "./soknadsStatusUtils";
import SoknadsStatusLenke from "./SoknadsStatusLenke";
import React from "react";
import styled from "styled-components";
import {useTranslation} from "react-i18next";
import {SoknadsStatusResponseStatus} from "../../generated/model";

const HeadingWrapper = styled.div`
    text-align: center;
`;

export const ContentPanelBorder = styled.div<{
    lightColor?: boolean;
}>`
    border-bottom: 2px solid var(${(props) => (props.lightColor ? "--a-border-on-inverted" : "--a-border-default")});
    margin: 1rem 0;
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
            <ContentPanelBorder />
        </HeadingWrapper>
    );
};
export default SoknadsStatusHeading;
