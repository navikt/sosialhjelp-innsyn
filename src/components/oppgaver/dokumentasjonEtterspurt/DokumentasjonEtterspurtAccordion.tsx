import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import {FormattedMessage} from "react-intl";
import {formatDato} from "../../../utils/formatting";
import {OpplastingAvVedleggModal} from "../OpplastingAvVedleggModal";
import DriftsmeldingVedlegg from "../../driftsmelding/DriftsmeldingVedlegg";
import {REST_STATUS, skalViseLastestripe} from "../../../utils/restUtils";
import {DokumentasjonEtterspurt, HendelseTypeEnum} from "../../../redux/innsynsdata/innsynsdataReducer";
import DokumentasjonEtterspurtView from "./DokumentasjonEtterspurtView";
import React from "react";

function getAntallDagerTekst(antallDagerSidenFristBlePassert: number): string {
    return antallDagerSidenFristBlePassert > 1
        ? antallDagerSidenFristBlePassert + " dager"
        : antallDagerSidenFristBlePassert + " dag";
}

function foersteInnsendelsesfrist(dokumentasjonEtterspurt: DokumentasjonEtterspurt[]): Date | null {
    if (dokumentasjonEtterspurt.length > 0) {
        const innsendelsesfrister = dokumentasjonEtterspurt.map(
            (dokumentasjon: DokumentasjonEtterspurt) => new Date(dokumentasjon.innsendelsesfrist!!)
        );
        return innsendelsesfrister[0];
    }
    return null;
}

interface Props {
    restStatus_oppgaver: REST_STATUS;
    dokumentasjonEtterspurt: DokumentasjonEtterspurt[];
}

export const DokumentasjonEtterspurtAccordion = (props: Props) => {
    const brukerHarDokumentasjonEtterspurt = props.dokumentasjonEtterspurt.length > 0;

    const dokumentasjonEtterspurtErFraInnsyn =
        brukerHarDokumentasjonEtterspurt &&
        props.dokumentasjonEtterspurt[0].oppgaveElementer[0].hendelsetype === HendelseTypeEnum.DOKUMENTASJON_ETTERSPURT;
    const innsendelsesfrist = dokumentasjonEtterspurtErFraInnsyn
        ? foersteInnsendelsesfrist(props.dokumentasjonEtterspurt)
        : null;

    return (
        <Accordion>
            <Accordion.Item defaultOpen>
                <Accordion.Header
                    onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet etterspørsel av dokumentasjon")}
                >
                    <div>
                        <Label as="p">
                            {dokumentasjonEtterspurtErFraInnsyn ? (
                                <FormattedMessage id="oppgaver.maa_sende_dok_veileder" />
                            ) : (
                                <FormattedMessage id="oppgaver.maa_sende_dok" />
                            )}
                        </Label>
                    </div>
                </Accordion.Header>
                <Accordion.Content>
                    {dokumentasjonEtterspurtErFraInnsyn ? (
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
                                        oppgaverErFraInnsyn={dokumentasjonEtterspurtErFraInnsyn}
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
