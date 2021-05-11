import React, {useState} from "react";
import {DokumentasjonKrav, KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {getVisningstekster, oppgaveHasFilesWithError} from "../../utils/vedleggUtils";
import DokumentasjonkravElementView from "./DokumentasjonkravElementView";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {antallDagerEtterFrist} from "./Oppgaver";
import {REST_STATUS} from "../../utils/restUtils";

interface Props {
    dokumentasjonKrav: DokumentasjonKrav;
    dokumentasjonKravIndex: any;
}

const DokumentasjonKravView: React.FC<Props> = ({dokumentasjonKrav, dokumentasjonKravIndex}) => {
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

    //const opplastingFeilet = oppgaveHasFilesWithError(dokumentasjonKrav.dokumentasjonkravElementer);

    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(dokumentasjonKrav.frist!!));
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    /*    const visDokumentasjonEtterspurtDetaljeFeiler: boolean =
        listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonKrav.oppgaveId) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend.includes(dokumentasjonKrav.oppgaveId) ||
        listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend.includes(dokumentasjonKrav.oppgaveId);*/

    return (
        <div>
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
        </div>
    );
};

export default DokumentasjonKravView;
