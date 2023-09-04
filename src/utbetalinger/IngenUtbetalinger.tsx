import {useTranslation} from "react-i18next";
import {BodyLong, Heading} from "@navikt/ds-react";
import {StyledGuidePanel} from "../styles/styledGuidePanel";

import React from "react";
import styled from "styled-components";
import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";

const StyledGuidePanelContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 3rem;
`;

const WrapperDl = styled.dl`
    dd {
        display: list-item;
    }
`;

const Wrapper = styled.div`
    padding-top: 1rem;
`;

export const IngenUtbetalinger = () => {
    const {t} = useTranslation("utbetalinger");

    return (
        <Wrapper>
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading size="medium" level="2">
                        {t("ingen.utbetalinger.tittel")}
                    </Heading>
                    <WrapperDl>
                        <dt>
                            <BodyLong>{t("ingen.utbetalinger.nøkkelpunt.tittel")}</BodyLong>
                        </dt>
                        <dd style={{display: "list-item"}}>
                            <BodyLong>{t("ingen.utbetalinger.nøkkelpunkt1")}</BodyLong>
                        </dd>
                        <dd>
                            <BodyLong>{t("ingen.utbetalinger.nøkkelpunkt2")}</BodyLong>
                        </dd>
                        <dd>
                            <BodyLong>{t("ingen.utbetalinger.nøkkelpunkt3")}</BodyLong>
                        </dd>
                    </WrapperDl>
                </StyledGuidePanelContent>
            </StyledGuidePanel>
        </Wrapper>
    );
};
