import { Accordion, BodyShort, Label } from "@navikt/ds-react";
import React from "react";
import { useTranslations } from "next-intl";

import { logSokerFaarVilkaar, logVilkarDuplications } from "../../../utils/amplitude";
import { VilkarResponse } from "../../../generated/model";

import { VilkarView } from "./VilkarView";

export const getUnikeVilkar = (vilkar: VilkarResponse[]) =>
    vilkar.filter(
        (vilkarElement, index, self) =>
            index ===
            self.findIndex((it) => it.beskrivelse === vilkarElement.beskrivelse && it.tittel === vilkarElement.tittel)
    );

interface Props {
    vilkar: VilkarResponse[] | undefined;
}
export const VilkarAccordion = (props: Props) => {
    const t = useTranslations("common");
    if (!props.vilkar || props.vilkar.length === 0) return null;
    const unikeVilkar = getUnikeVilkar(props.vilkar);
    logVilkarDuplications(props.vilkar.length, unikeVilkar.length);
    logSokerFaarVilkaar();
    return (
        <>
            <Accordion.Item defaultOpen>
                <Accordion.Header>
                    <Label as="p">{t("vilkar.du_har_vilkar")}</Label>
                    <BodyShort>{t("vilkar.veileder_trenger_mer")}</BodyShort>
                </Accordion.Header>
                <Accordion.Content>
                    <VilkarView vilkar={unikeVilkar} />
                </Accordion.Content>
            </Accordion.Item>
        </>
    );
};
