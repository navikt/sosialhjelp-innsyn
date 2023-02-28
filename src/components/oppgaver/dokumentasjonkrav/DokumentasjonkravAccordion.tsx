import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import {useTranslation} from "react-i18next";
import {DokumentasjonKrav} from "../../../redux/innsynsdata/innsynsdataReducer";
import DokumentasjonKravView from "./DokumentasjonKravView";
import React from "react";

interface Props {
    dokumentasjonkrav: DokumentasjonKrav[];
    feilmelding?: React.ReactNode;
}

export const DokumentasjonkravAccordion = (props: Props) => {
    const {t} = useTranslation();

    return (
        <Accordion>
            <Accordion.Item defaultOpen>
                <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet dokumentasjonkrav")}>
                    <Label as="p">{t("dokumentasjonkrav.dokumentasjon_stonad")}</Label>
                    <BodyShort>{t("dokumentasjonkrav.veileder_trenger_mer")}</BodyShort>
                </Accordion.Header>
                <Accordion.Content>
                    {props.feilmelding}
                    {props.dokumentasjonkrav.map((krav: DokumentasjonKrav, index: number) => (
                        <DokumentasjonKravView dokumentasjonkrav={krav} key={index} />
                    ))}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
