import * as React from "react";
import { useTranslations } from "next-intl";
import { Accordion, BodyShort, Label } from "@navikt/ds-react";
import { PaperclipIcon, BulletListIcon } from "@navikt/aksel-icons";
import styled from "styled-components";

const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 20px 12px;
`;

const OppgaveInformasjon = () => {
    const t = useTranslations("common");

    return (
        <>
            <Accordion.Item>
                <Accordion.Header>
                    <Label as="p">{t("oppgaver.vilkar.tittel.tittel")}</Label>
                    <BodyShort>{t("oppgaver.vilkar.tittel.tekst")}</BodyShort>
                </Accordion.Header>
                <Accordion.Content>
                    <StyledContainer>
                        <>
                            <BulletListIcon
                                width="1.5rem"
                                height="1.5rem"
                                style={{ marginTop: "6px" }}
                                aria-hidden
                                title="liste"
                            />
                            <div>
                                <Label as="p">{t("oppgaver.vilkar.tittel.vilkar")}</Label>
                                <BodyShort>{t("oppgaver.vilkar.beskrivelse")}</BodyShort>
                            </div>
                        </>
                        <>
                            <PaperclipIcon
                                width="1.5rem"
                                height="1.5rem"
                                style={{ marginTop: "6px" }}
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
