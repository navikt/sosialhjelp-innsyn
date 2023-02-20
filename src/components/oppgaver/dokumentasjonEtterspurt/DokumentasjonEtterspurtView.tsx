import React from "react";
import {DokumentasjonEtterspurt} from "../../../redux/innsynsdata/innsynsdataReducer";
import {useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import {InnsynAppState} from "../../../redux/reduxTypes";
import {isFileUploadAllowed} from "../../driftsmelding/DriftsmeldingUtilities";
import {oppgaveHasFilesWithError} from "../../../utils/vedleggUtils";
import {logDuplicationsOfUploadedAttachmentsForDokEtterspurt} from "../../../utils/amplitude";
import {ErrorMessage} from "../../errors/ErrorMessage";
import useKommune from "../../../hooks/useKommune";
import InnsendelsesFrist from "../InnsendelsesFrist";
import SendButton from "./SendButton";
import styles from "./dokumentasjonEtterspurt.module.css";
import DokumentasjonEtterspurtElementView from "./DokumentasjonEtterspurtElementView";

interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurt;
    oppgaverErFraInnsyn: boolean;
    oppgaveIndex: any;
}
const DokumentasjonEtterspurtView: React.FC<Props> = ({dokumentasjonEtterspurt, oppgaverErFraInnsyn, oppgaveIndex}) => {
    logDuplicationsOfUploadedAttachmentsForDokEtterspurt(dokumentasjonEtterspurt, oppgaveIndex);

    const listeOverDokumentasjonEtterspurtIderSomFeilet: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOpggaveIderSomFeilet
    );
    const listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );

    const {kommune, isLoading} = useKommune();
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommune);

    const opplastingFeilet = oppgaveHasFilesWithError(dokumentasjonEtterspurt.oppgaveElementer);

    const visDokumentasjonEtterspurtDetaljeFeiler: boolean =
        listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId) ||
        opplastingFeilet !== undefined ||
        listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend.includes(dokumentasjonEtterspurt.oppgaveId) ||
        listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend.includes(dokumentasjonEtterspurt.oppgaveId);

    return (
        <li>
            <div
                className={
                    (visDokumentasjonEtterspurtDetaljeFeiler ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") +
                    " luft_over_1rem"
                }
            >
                {oppgaverErFraInnsyn && <InnsendelsesFrist frist={dokumentasjonEtterspurt.innsendelsesfrist} />}
                <ul className={styles.unorderedList}>
                    {dokumentasjonEtterspurt.oppgaveElementer.map((oppgaveElement, oppgaveElementIndex) => {
                        return (
                            <li key={oppgaveElementIndex}>
                                <DokumentasjonEtterspurtElementView
                                    oppgaveElement={oppgaveElement}
                                    oppgaveElementIndex={oppgaveElementIndex}
                                    oppgaveIndex={oppgaveIndex}
                                    oppgaveId={dokumentasjonEtterspurt.oppgaveId}
                                />
                            </li>
                        );
                    })}
                </ul>
                {listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend.includes(dokumentasjonEtterspurt.oppgaveId) && (
                    <ErrorMessage className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                        <FormattedMessage id={"vedlegg.opplasting_backend_feilmelding"} />
                    </ErrorMessage>
                )}
                {!isLoading && kanLasteOppVedlegg && <SendButton dokumentasjonEtterspurt={dokumentasjonEtterspurt} />}
            </div>
            {listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend.includes(
                dokumentasjonEtterspurt.oppgaveId
            ) && (
                <ErrorMessage className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_virus_feilmelding"} />
                </ErrorMessage>
            )}

            {(listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId) ||
                opplastingFeilet) && (
                <ErrorMessage className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={
                            listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId)
                                ? "vedlegg.minst_ett_vedlegg"
                                : "vedlegg.opplasting_feilmelding"
                        }
                    />
                </ErrorMessage>
            )}
        </li>
    );
};

export default DokumentasjonEtterspurtView;
