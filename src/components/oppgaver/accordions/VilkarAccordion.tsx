import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import React from "react";
import {FormattedMessage} from "react-intl";
import {Vilkar} from "../../../redux/innsynsdata/innsynsdataReducer";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import {VilkarView} from "../VilkarView";

export const getUnikeVilkar = (vilkar: Vilkar[]) => {
    const vilkarCopy = Array.from(vilkar);
    return vilkarCopy.filter(
        (vilkarElement, index, self) =>
            index ===
            self.findIndex((it) => it.beskrivelse === vilkarElement.beskrivelse && it.tittel === vilkarElement.tittel)
    );
};
export const VilkarAccordion = (props: {vilkar: Vilkar[]}) => {
    const unikeVilkar = getUnikeVilkar(props.vilkar);

    return (
        <Accordion>
            <Accordion.Item>
                <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet vilkår")}>
                    <div>
                        <Label>{<FormattedMessage id="vilkar.du_har_vilkar" />}</Label>
                        <BodyShort>
                            <FormattedMessage id="vilkar.veileder_trenger_mer" />
                        </BodyShort>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    {unikeVilkar.map((vilkarElement, index) => (
                        <VilkarView key={index} vilkar={vilkarElement} />
                    ))}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
