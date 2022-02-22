import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import {FormattedMessage} from "react-intl";
import {DokumentasjonKrav} from "../../../redux/innsynsdata/innsynsdataReducer";
import DokumentasjonKravView from "../DokumentasjonKravView";
import React from "react";

export const DokumentasjonkravAccordion = (props: {dokumentasjonkrav: DokumentasjonKrav[]}) => {
    return (
        <Accordion>
            <Accordion.Item>
                <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet dokumentasjonkrav")}>
                    <div>
                        <Label>
                            <FormattedMessage id="dokumentasjonkrav.dokumentasjon_stonad" />
                        </Label>
                        <BodyShort>
                            <FormattedMessage id="dokumentasjonkrav.veileder_trenger_mer" />
                        </BodyShort>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    {props.dokumentasjonkrav.map((krav: DokumentasjonKrav, index: number) => (
                        <DokumentasjonKravView dokumentasjonkrav={krav} key={index} dokumentasjonkravIndex={index} />
                    ))}
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
