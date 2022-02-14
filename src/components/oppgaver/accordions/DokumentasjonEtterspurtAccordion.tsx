import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import DokumentBinder from "../../ikoner/DocumentBinder";
import {FormattedMessage} from "react-intl";
import {formatDato} from "../../../utils/formatting";
import {OpplastingAvVedleggModal} from "../OpplastingAvVedleggModal";
import DriftsmeldingVedlegg from "../../driftsmelding/DriftsmeldingVedlegg";
import {REST_STATUS, skalViseLastestripe} from "../../../utils/restUtils";
import {DokumentasjonEtterspurt} from "../../../redux/innsynsdata/innsynsdataReducer";
import DokumentasjonEtterspurtView from "../DokumentasjonEtterspurtView";
import React from "react";
import {StyledAccordion} from "../Oppgaver";

function getAntallDagerTekst(antallDagerSidenFristBlePassert: number): string {
    return antallDagerSidenFristBlePassert > 1
        ? antallDagerSidenFristBlePassert + " dager"
        : antallDagerSidenFristBlePassert + " dag";
}

export const DokumentasjonEtterspurtAccordion = (props: {
    dokumentasjonEtterspurtErFraInnsyn: boolean;
    antallDagerSidenFristBlePassert: number;
    innsendelsesfrist: null | Date;
    restStatus_oppgaver: REST_STATUS;
    dokumentasjonEtterspurt: DokumentasjonEtterspurt[];
}) => {
    return (
        <StyledAccordion>
            <Accordion.Item>
                <Accordion.Header
                    onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet etterspørsel av dokumentasjon")}
                >
                    <div className="oppgaver_header">
                        <DokumentBinder />
                        <div>
                            <Label>
                                {props.dokumentasjonEtterspurtErFraInnsyn && (
                                    <FormattedMessage id="oppgaver.maa_sende_dok_veileder" />
                                )}
                                {!props.dokumentasjonEtterspurtErFraInnsyn && (
                                    <FormattedMessage id="oppgaver.maa_sende_dok" />
                                )}
                            </Label>
                            <BodyShort>
                                {props.dokumentasjonEtterspurtErFraInnsyn &&
                                    props.antallDagerSidenFristBlePassert <= 0 && (
                                        <FormattedMessage
                                            id="oppgaver.neste_frist"
                                            values={{
                                                innsendelsesfrist:
                                                    props.innsendelsesfrist != null
                                                        ? formatDato(props.innsendelsesfrist.toISOString())
                                                        : "",
                                            }}
                                        />
                                    )}
                                {props.dokumentasjonEtterspurtErFraInnsyn && props.antallDagerSidenFristBlePassert > 0 && (
                                    <FormattedMessage
                                        id="oppgaver.neste_frist_passert"
                                        values={{
                                            antall_dager: getAntallDagerTekst(props.antallDagerSidenFristBlePassert),
                                            innsendelsesfrist:
                                                props.innsendelsesfrist != null
                                                    ? formatDato(props.innsendelsesfrist!.toISOString())
                                                    : "",
                                        }}
                                    />
                                )}
                            </BodyShort>
                        </div>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    {props.dokumentasjonEtterspurtErFraInnsyn ? (
                        <BodyShort>
                            <FormattedMessage id="oppgaver.veileder_trenger_mer" />
                        </BodyShort>
                    ) : (
                        <BodyShort>
                            <FormattedMessage id="oppgaver.last_opp_vedlegg_ikke" />
                        </BodyShort>
                    )}

                    <OpplastingAvVedleggModal />

                    <DriftsmeldingVedlegg leserData={skalViseLastestripe(props.restStatus_oppgaver)} />

                    <div>
                        {props.dokumentasjonEtterspurt !== null &&
                            props.dokumentasjonEtterspurt.map(
                                (dokumentasjon: DokumentasjonEtterspurt, index: number) => (
                                    <DokumentasjonEtterspurtView
                                        dokumentasjonEtterspurt={dokumentasjon}
                                        key={index}
                                        oppgaverErFraInnsyn={props.dokumentasjonEtterspurtErFraInnsyn}
                                        oppgaveIndex={index}
                                    />
                                )
                            )}
                    </div>
                </Accordion.Content>
            </Accordion.Item>
        </StyledAccordion>
    );
};
