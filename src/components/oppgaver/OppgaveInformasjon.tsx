import * as React from "react";
import {useTranslation} from "next-i18next";
import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import {Attachment, List} from "@navikt/ds-icons";
import styled from "styled-components";
import {logButtonOrLinkClick} from "../../utils/amplitude";

const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 20px 12px;
`;

const OppgaveInformasjon = () => {
    const {t} = useTranslation();

    return (
        <>
            <Accordion.Item>
                <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet informasjons boks")}>
                    <Label as="p">{t("oppgaver.vilkar.tittel")}</Label>
                    <BodyShort>{t("oppgaver.vilkar.tittel.tekst")}</BodyShort>
                </Accordion.Header>
                <Accordion.Content>
                    <StyledContainer>
                        <>
                            <List width="1.5rem" height="1.5rem" style={{marginTop: "6px"}} aria-hidden title="liste" />
                            <div>
                                <Label as="p">{t("oppgaver.vilkar")}</Label>
                                <BodyShort>{t("oppgaver.vilkar.beskrivelse")}</BodyShort>
                            </div>
                        </>
                        <>
                            <Attachment
                                width="1.5rem"
                                height="1.5rem"
                                style={{marginTop: "6px"}}
                                aria-hidden
                                title="vedlegg"
                            />
                            <div>
                                <Label as="p">{t("oppgaver.vilkar.dokumentasjonskrav")}</Label>
                                <BodyShort>{t("oppgaver.vilkar.dokumentasjonskrav.beskrivelse")}</BodyShort>
                            </div>
                        </>
                    </StyledContainer>
                </Accordion.Content>
            </Accordion.Item>
        </>
    );
};

export default OppgaveInformasjon;
