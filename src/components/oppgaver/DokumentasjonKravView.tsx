import React, {useState} from "react";
import {
    DokumentasjonKrav,
    DokumentasjonKravElement,
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

interface Props {
    dokumentasjonKrav: DokumentasjonKrav;
    dokumentasjonKravIndex: any;
}

const DokumentasjonKravView: React.FC<Props> = ({dokumentasjonKrav, dokumentasjonKravIndex}) => {
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

    const visDokumentasjonEtterspurtDetaljeFeiler: boolean =
        includesReferense(dokumentasjonkravReferanserSomFeilet) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        includesReferense(dokumentasjonkravReferanserSomFeiletPaBackend) ||
        includesReferense(dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend);

    return (
        <div
            className={
                (visDokumentasjonEtterspurtDetaljeFeiler ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") +
                " luft_over_1rem"
            }
        >
            {dokumentasjonKrav.dokumentasjonkravElementer.map(
                (dokumentasjonkravElement, dokumentasjonkravElementIndex) => {
                    let {typeTekst, tilleggsinfoTekst} = getVisningstekster(
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
                            dokumetasjonKravId={"testId"}
                            setOverMaksStorrelse={setOverMaksStorrelse}
                        />
                    );
                }
            )}

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
                            "testId",
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
    );
};

export default DokumentasjonKravView;
