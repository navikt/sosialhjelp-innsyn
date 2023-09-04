import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import React from "react";
import {BodyLong, Heading} from "@navikt/ds-react";
import {StyledGuidePanel} from "../styles/styledGuidePanel";
import styled from "styled-components";
import {useTranslation} from "react-i18next";

const StyledGuidePanelContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 3rem;
`;

const Wrapper = styled.div`
    padding-top: 1rem;
`;

const UtbetalingsoversiktIngenInnsyn: React.FC = () => {
    const {t} = useTranslation();

    return (
        <Wrapper>
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading level="2" size="medium" spacing>
                        {t("ingen_soknad.tittel")}
                    </Heading>
                    <BodyLong>{t("ingen_soknad.info")}</BodyLong>
                </StyledGuidePanelContent>
            </StyledGuidePanel>
        </Wrapper>
    );
};

export default UtbetalingsoversiktIngenInnsyn;
