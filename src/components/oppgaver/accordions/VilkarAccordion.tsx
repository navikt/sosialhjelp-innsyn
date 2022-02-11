import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import React from "react";
import {FormattedMessage} from "react-intl";
import {Vilkar} from "../../../redux/innsynsdata/innsynsdataReducer";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import DokumentBinder from "../../ikoner/DocumentBinder";
import {StyledAccordion} from "../Oppgaver";
import {VilkarView} from "../VilkarView";

export const VilkarAccordion = (props: {vilkar: Vilkar[]}) => (
    <StyledAccordion>
        <Accordion.Item>
            <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet vilkår")}>
                <div className="oppgaver_header">
                    <DokumentBinder />
                    <div>
                        <Label>{<FormattedMessage id="vilkar.du_har_vilkar" />}</Label>
                        <BodyShort>
                            <FormattedMessage id="vilkar.veileder_trenger_mer" />
                        </BodyShort>
                    </div>
                </div>
            </Accordion.Header>
            <Accordion.Content>
                {props.vilkar.map((vilkarElement, index) => (
                    <VilkarView key={index} vilkar={vilkarElement} />
                ))}
            </Accordion.Content>
        </Accordion.Item>
    </StyledAccordion>
);
