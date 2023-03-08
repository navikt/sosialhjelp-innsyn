import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import React from "react";
import {useTranslation} from "react-i18next";
import {Vilkar} from "../../../redux/innsynsdata/innsynsdataReducer";
import {logButtonOrLinkClick, logVilkarDuplications} from "../../../utils/amplitude";
import {VilkarView} from "./VilkarView";

export const getUnikeVilkar = (vilkar: Vilkar[]) => {
    const vilkarCopy = Array.from(vilkar);
    return vilkarCopy.filter(
        (vilkarElement, index, self) =>
            index ===
            self.findIndex((it) => it.beskrivelse === vilkarElement.beskrivelse && it.tittel === vilkarElement.tittel)
    );
};

interface Props {
    vilkar: Vilkar[];
    feilmelding?: React.ReactNode;
}
export const VilkarAccordion = (props: Props) => {
    const {t} = useTranslation();
    const unikeVilkar = getUnikeVilkar(props.vilkar);
    logVilkarDuplications(props.vilkar);

    return (
        <Accordion>
            <Accordion.Item defaultOpen>
                <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet vilkår")}>
                    <Label as="p">{t("vilkar.du_har_vilkar")}</Label>
                    <BodyShort>{t("vilkar.veileder_trenger_mer")}</BodyShort>
                </Accordion.Header>
                <Accordion.Content>
                    {props.feilmelding}
                    <VilkarView vilkar={unikeVilkar} />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
