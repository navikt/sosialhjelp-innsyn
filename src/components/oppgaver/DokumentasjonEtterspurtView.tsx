import React, {useState} from "react";
import {Normaltekst} from "nav-frontend-typografi";
import {DokumentasjonEtterspurt, InnsynsdataSti, KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {useDispatch, useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {antallDagerEtterFrist} from "./Oppgaver";
import {formatDato} from "../../utils/formatting";
import {getVisningstekster, oppgaveHasFilesWithError} from "../../utils/vedleggUtils";
import {Hovedknapp} from "nav-frontend-knapper";
import {REST_STATUS} from "../../utils/restUtils";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";
import DokumentasjonEtterspurtElementView from "./DokumentasjonEtterspurtElementView";
import {onSendVedleggClicked} from "./onSendVedleggClicked";

interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurt;
    oppgaverErFraInnsyn: boolean;
    oppgaveIndex: any;
}

const DokumentasjonEtterspurtView: React.FC<Props> = ({dokumentasjonEtterspurt, oppgaverErFraInnsyn, oppgaveIndex}) => {
    const dispatch = useDispatch();
    const listeOverDokumentasjonEtterspurtIderSomFeilet: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOpggaveIderSomFeilet
    );
    const listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommuneResponse);

    const opplastingFeilet = oppgaveHasFilesWithError(dokumentasjonEtterspurt.oppgaveElementer);

    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(dokumentasjonEtterspurt.innsendelsesfrist!!));
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const visDokumentasjonEtterspurtDetaljeFeiler: boolean =
        listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend.includes(dokumentasjonEtterspurt.oppgaveId) ||
        listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend.includes(dokumentasjonEtterspurt.oppgaveId);

    return (
        <div>
            <div
                className={
                    (visDokumentasjonEtterspurtDetaljeFeiler ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") +
                    " luft_over_1rem"
                }
            >
                {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert <= 0 && (
                    <Normaltekst className="luft_under_8px">
                        <FormattedMessage
                            id="oppgaver.innsendelsesfrist"
                            values={{innsendelsesfrist: formatDato(dokumentasjonEtterspurt.innsendelsesfrist!)}}
                        />
                    </Normaltekst>
                )}
                {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert > 0 && (
                    <Normaltekst className="luft_under_8px">
                        <FormattedMessage
                            id="oppgaver.innsendelsesfrist_passert"
                            values={{innsendelsesfrist: formatDato(dokumentasjonEtterspurt.innsendelsesfrist!)}}
                        />
                    </Normaltekst>
                )}
                {dokumentasjonEtterspurt.oppgaveElementer.map((oppgaveElement, oppgaveElementIndex) => {
                    let {typeTekst, tilleggsinfoTekst} = getVisningstekster(
                        oppgaveElement.dokumenttype,
                        oppgaveElement.tilleggsinformasjon
                    );
                    return (
                        <DokumentasjonEtterspurtElementView
                            key={oppgaveElementIndex}
                            typeTekst={typeTekst}
                            tilleggsinfoTekst={tilleggsinfoTekst}
                            oppgaveElement={oppgaveElement}
                            oppgaveElementIndex={oppgaveElementIndex}
                            oppgaveIndex={oppgaveIndex}
                            oppgaveId={dokumentasjonEtterspurt.oppgaveId}
                            setOverMaksStorrelse={setOverMaksStorrelse}
                        />
                    );
                })}

                {kanLasteOppVedlegg && (
                    <Hovedknapp
                        disabled={vedleggLastesOpp || otherVedleggLastesOpp}
                        spinner={vedleggLastesOpp}
                        type="hoved"
                        className="luft_over_1rem"
                        onClick={(event: any) => {
                            onSendVedleggClicked(
                                event,
                                dispatch,
                                dokumentasjonEtterspurt.oppgaveId,
                                InnsynsdataSti.OPPGAVER,
                                fiksDigisosId,
                                setOverMaksStorrelse,
                                dokumentasjonEtterspurt,
                                undefined,
                                undefined
                            );
                        }}
                    >
                        <FormattedMessage id="oppgaver.send_knapp_tittel" />
                    </Hovedknapp>
                )}
            </div>

            {listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend.includes(dokumentasjonEtterspurt.oppgaveId) && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_feilmelding"} />
                </SkjemaelementFeilmelding>
            )}

            {listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend.includes(
                dokumentasjonEtterspurt.oppgaveId
            ) && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_virus_feilmelding"} />
                </SkjemaelementFeilmelding>
            )}

            {overMaksStorrelse && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.ulovlig_storrelse_av_alle_valgte_filer"} />
                </SkjemaelementFeilmelding>
            )}
            {(listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId) ||
                opplastingFeilet) && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={
                            listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId)
                                ? "vedlegg.minst_ett_vedlegg"
                                : "vedlegg.opplasting_feilmelding"
                        }
                    />
                </SkjemaelementFeilmelding>
            )}
        </div>
    );
};

export default DokumentasjonEtterspurtView;
