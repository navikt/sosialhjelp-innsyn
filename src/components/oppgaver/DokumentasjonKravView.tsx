import React, {useState} from "react";
import {DokumentasjonKrav, Fil, InnsynsdataSti, KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {
    createFormDataWithVedleggFromDokumentasjonkrav,
    dokumentasjonkravHasFilesWithError,
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
    dokumentasjonkrav: DokumentasjonKrav;
    dokumentasjonkravIndex: number;
}

export interface DokumentasjonKravFiler {
    [key: string]: Fil[];
}

const DokumentasjonKravView: React.FC<Props> = ({dokumentasjonkrav, dokumentasjonkravIndex}) => {
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

    const opplastingFeilet = dokumentasjonkravHasFilesWithError(dokumentasjonkrav.dokumentasjonkravElementer);

    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(dokumentasjonkrav.frist!!));
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const formData = createFormDataWithVedleggFromDokumentasjonkrav(dokumentasjonkrav, dokumentasjonkravFiler);

    let filer = Array.from(Object.values(dokumentasjonkravFiler)).flatMap((dokkrav) => {
        return dokkrav;
    });

    const includesReferense = (feilReferanse: string[]) => {
        dokumentasjonkrav.dokumentasjonkravElementer.filter((dokkrav) => {
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
            } else {
                newDokumentasjonkrav[dokumentasjonkravReferanse] = filer;
            }
            setDokumentasjonkravFiler(newDokumentasjonkrav);
        }

        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const onDeleteClick = (event: any, dokumentasjonkravReferanse: string, fil: Fil) => {
        //todo må teste med flere dokkrav-bokser
        if (dokumentasjonkravReferanse !== "" && fil) {
            const newDokumentasjonkrav = {...dokumentasjonkravFiler};
            if (newDokumentasjonkrav[dokumentasjonkravReferanse]) {
                newDokumentasjonkrav[dokumentasjonkravReferanse] = newDokumentasjonkrav[
                    dokumentasjonkravReferanse
                ].filter((dokkrav) => dokkrav.file !== fil.file);
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
                {dokumentasjonkrav.dokumentasjonkravElementer.map(
                    (dokumentasjonkravElement, dokumentasjonkravElementIndex) => {
                        return (
                            <DokumentasjonkravElementView
                                key={dokumentasjonkravElementIndex}
                                dokumentasjonkravElement={dokumentasjonkravElement}
                                dokumentasjonKravIndex={dokumentasjonkravIndex}
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
                                dokumentasjonkravIndex + "",
                                InnsynsdataSti.DOKUMENTASJONKRAV,
                                fiksDigisosId,
                                setOverMaksStorrelse,
                                undefined,
                                formData,
                                filer.length > 0 ? filer : undefined
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
