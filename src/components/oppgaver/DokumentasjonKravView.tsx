import React, {ChangeEvent, useState} from "react";
import {
    DokumentasjonKrav,
    DokumentasjonKravElement,
    Fil,
    InnsynsdataSti,
    KommuneResponse,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {
    dokumentasjonkravHasFilesWithError,
    getVisningstekster,
    oppgaveHasFilesWithError,
} from "../../utils/vedleggUtils";
import DokumentasjonkravElementView from "./DokumentasjonkravElementView";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {antallDagerEtterFrist} from "./Oppgaver";
import {REST_STATUS} from "../../utils/restUtils";
import {Hovedknapp} from "nav-frontend-knapper";
import {onSendVedleggClicked} from "./onSendVedleggClicked";
import {FormattedMessage} from "react-intl";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";

interface Props {
    dokumentasjonKrav: DokumentasjonKrav;
    dokumentasjonKravIndex: number;
}

interface DokumentasjonKravFiler {
    [key: string]: Fil[];
}

const DokumentasjonKravView: React.FC<Props> = ({dokumentasjonKrav, dokumentasjonKravIndex}) => {
    const [dokumentasjonkravFiler, setDokumentasjonkravFiler] = useState<DokumentasjonKravFiler>({});

    const dispatch = useDispatch();
    const dokumentasjonkravReferanserSomFeilet: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.dokumentasjonkravReferanserSomFeilet
    );
    const dokumentasjonkravReferanserSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.dokumentasjonkravReferanserSomFeiletPaBackend
    );
    const dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend
    );

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommuneResponse);

    const opplastingFeilet = dokumentasjonkravHasFilesWithError(dokumentasjonKrav.dokumentasjonkravElementer);

    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(dokumentasjonKrav.frist!!));
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const includesReferense = (feilReferanse: string[]) => {
        dokumentasjonKrav.dokumentasjonkravElementer.filter((dokkrav) => {
            if (dokkrav.dokumentasjonkravReferanse) {
                return feilReferanse.includes(dokkrav.dokumentasjonkravReferanse);
            }
            return false;
        });
        return false;
    };

    const visDokumentasjonkravDetaljerFeiler: boolean =
        includesReferense(dokumentasjonkravReferanserSomFeilet) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        includesReferense(dokumentasjonkravReferanserSomFeiletPaBackend) ||
        includesReferense(dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend);

    const onChange = (event: any, dokumentasjonkravReferanse: string) => {
        //til senere husk legg til validering av fil
        const files: FileList | null = event.currentTarget.files;

        if (files) {
            const filer = Array.from(files).map((file: File) => {
                return {filnavn: file.name, status: "INITIALISERT", file: file};
            });
            const newDokumentasjonkrav = {...dokumentasjonkravFiler};
            if (newDokumentasjonkrav[dokumentasjonkravReferanse]) {
                newDokumentasjonkrav[dokumentasjonkravReferanse] = newDokumentasjonkrav[
                    dokumentasjonkravReferanse
                ].concat(filer);
                console.log(
                    "newDokumentasjonkrav[dokumentasjonkravReferanse]",
                    newDokumentasjonkrav[dokumentasjonkravReferanse]
                );
            } else {
                newDokumentasjonkrav[dokumentasjonkravReferanse] = filer;
            }
            setDokumentasjonkravFiler(newDokumentasjonkrav);
        }
    };

    const onDeleteClick = (event: any, dokumentasjonkravReferanse: string) => {
        //todo
        console.log("event ondelete", event.currentTarget.files);

        const files: FileList | null = event.currentTarget.files;

        if (files) {
            const filer = Array.from(files).map((file: File) => {
                return {filnavn: file.name, status: "INITIALISERT", file: file};
            });
            const newDokumentasjonkrav = {...dokumentasjonkravFiler};
            if (newDokumentasjonkrav[dokumentasjonkravReferanse]) {
                newDokumentasjonkrav[dokumentasjonkravReferanse] = newDokumentasjonkrav[
                    dokumentasjonkravReferanse
                ].filter((fil) => fil.filnavn == filer[0].filnavn);
                console.log(
                    "newDokumentasjonkrav[dokumentasjonkravReferanse]",
                    newDokumentasjonkrav[dokumentasjonkravReferanse]
                );
            } else {
                newDokumentasjonkrav[dokumentasjonkravReferanse] = filer;
            }
            setDokumentasjonkravFiler(newDokumentasjonkrav);
        }
    };

    return (
        <div>
            <div
                className={
                    (visDokumentasjonkravDetaljerFeiler ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") +
                    " luft_over_1rem"
                }
            >
                {dokumentasjonKrav.dokumentasjonkravElementer.map(
                    (dokumentasjonkravElement, dokumentasjonkravElementIndex) => {
                        const {typeTekst, tilleggsinfoTekst} = getVisningstekster(
                            dokumentasjonkravElement.tittel || "",
                            dokumentasjonkravElement.beskrivelse
                        );
                        return (
                            <DokumentasjonkravElementView
                                key={dokumentasjonkravElementIndex}
                                tittel={typeTekst}
                                beskrivelse={tilleggsinfoTekst}
                                dokumentasjonkravElement={dokumentasjonkravElement}
                                dokumentasjonkravElementIndex={dokumentasjonkravElementIndex}
                                dokumentasjonKravIndex={dokumentasjonKravIndex}
                                dokumetasjonKravId={dokumentasjonkravElement.dokumentasjonkravReferanse ?? ""}
                                setOverMaksStorrelse={setOverMaksStorrelse}
                                onChange={onChange}
                                onDelete={onDeleteClick}
                                filer={
                                    dokumentasjonkravFiler[dokumentasjonkravElement.dokumentasjonkravReferanse ?? ""] ??
                                    []
                                }
                            />
                        );
                    }
                )}

                {includesReferense(dokumentasjonkravReferanserSomFeiletPaBackend) && (
                    <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                        <FormattedMessage id={"vedlegg.opplasting_backend_feilmelding"} />
                    </SkjemaelementFeilmelding>
                )}

                {kanLasteOppVedlegg && (
                    <Hovedknapp
                        disabled={vedleggLastesOpp || otherVedleggLastesOpp}
                        spinner={vedleggLastesOpp}
                        type="hoved"
                        className="luft_over_1rem"
                        onClick={(event: any) => {
                            //må håndter å fjerne krav når filer blir sendt inn.
                            onSendVedleggClicked(
                                event,
                                dispatch,
                                dokumentasjonKravIndex + "",
                                InnsynsdataSti.DOKUMENTASJONKRAV,
                                fiksDigisosId,
                                setOverMaksStorrelse,
                                undefined,
                                dokumentasjonKrav,
                                undefined
                            );
                        }}
                    >
                        <FormattedMessage id="oppgaver.send_knapp_tittel" />
                    </Hovedknapp>
                )}
            </div>
            {includesReferense(dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend) && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_virus_feilmelding"} />
                </SkjemaelementFeilmelding>
            )}

            {overMaksStorrelse && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.ulovlig_storrelse_av_alle_valgte_filer"} />
                </SkjemaelementFeilmelding>
            )}
            {(includesReferense(dokumentasjonkravReferanserSomFeilet) || opplastingFeilet) && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={
                            includesReferense(dokumentasjonkravReferanserSomFeilet)
                                ? "vedlegg.minst_ett_vedlegg"
                                : "vedlegg.opplasting_feilmelding"
                        }
                    />
                </SkjemaelementFeilmelding>
            )}
        </div>
    );
};

export default DokumentasjonKravView;
