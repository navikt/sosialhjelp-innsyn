import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import {FormattedMessage} from "react-intl";
import {formatDato} from "../../../utils/formatting";
import {OpplastingAvVedleggModal} from "../OpplastingAvVedleggModal";
import DriftsmeldingVedlegg from "../../driftsmelding/DriftsmeldingVedlegg";
import {REST_STATUS, skalViseLastestripe} from "../../../utils/restUtils";
import {DokumentasjonEtterspurt} from "../../../redux/innsynsdata/innsynsdataReducer";
import DokumentasjonEtterspurtView from "../DokumentasjonEtterspurtView";
import React from "react";

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
        <Accordion>
            <Accordion.Item defaultOpen>
                <Accordion.Header
                    onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet etterspørsel av dokumentasjon")}
                >
                    <div>
                        <Label as="p">
                            {props.dokumentasjonEtterspurtErFraInnsyn ? (
                                <FormattedMessage id="oppgaver.maa_sende_dok_veileder" />
                            ) : (
                                <FormattedMessage id="oppgaver.maa_sende_dok" />
                            )}
                        </Label>
                        <BodyShort>
                            {props.dokumentasjonEtterspurtErFraInnsyn && props.antallDagerSidenFristBlePassert <= 0 && (
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
        </Accordion>
    );
};
