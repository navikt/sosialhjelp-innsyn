import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import DokumentBinder from "../../ikoner/DocumentBinder";
import {FormattedMessage} from "react-intl";
import {DokumentasjonKrav} from "../../../redux/innsynsdata/innsynsdataReducer";
import DokumentasjonKravView from "../DokumentasjonKravView";
import React from "react";
import {StyledAccordion} from "../Oppgaver";

export const DokumentasjonkravAccordion = (props: {dokumentasjonkrav: DokumentasjonKrav[]}) => {
    return (
        <StyledAccordion>
            <Accordion.Item>
                <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet dokumentasjonkrav")}>
                    <div className="oppgaver_header">
                        <DokumentBinder />
                        <div>
                            <Label>
                                <FormattedMessage id="dokumentasjonkrav.dokumentasjon_stonad" />
                            </Label>
                            <BodyShort>
                                <FormattedMessage id="dokumentasjonkrav.veileder_trenger_mer" />
                            </BodyShort>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    {props.dokumentasjonkrav.map((krav: DokumentasjonKrav, index: number) => (
                        <DokumentasjonKravView dokumentasjonkrav={krav} key={index} dokumentasjonkravIndex={index} />
                    ))}
                </Accordion.Content>
            </Accordion.Item>
        </StyledAccordion>
    );
};
