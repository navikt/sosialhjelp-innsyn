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
    borderSpace?: boolean;
    test?: string;
}>`
    //border-bottom: 2px solid var({(props) => (props.lightColor ? "--a-border-on-inverted" : "--a-border-default")});

    border-bottom: 2px solid
        ${(props) =>
            props.test === "red"
                ? "var(--a-red-700)"
                : props.test === "green"
                  ? "var(--a-green-700)"
                  : props.test === "blue"
                    ? "var(--a-blue-700)"
                    : props.test === "lightcolor"
                      ? "var(--a-border-divider)"
                      : props.test === "orange"
                        ? "var(--a-orange-700)"
                        : "transparent"};

    /**border-bottom: 2px solid var({(props) => ((props.lightColor ? "red" : "blue") || (props.headerBorder ? "green" : "brown"))});
  border-bottom: 1px solid {(props) => (props.borderSpace ? "var(--a-border-divider)" : "transparent")};**/
    margin: ${(props) => (props.borderSpace ? "1rem 0" : "0")};
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
            <ContentPanelBorder borderSpace test={"orange"} />
        </HeadingWrapper>
    );
};
export default SoknadsStatusHeading;
