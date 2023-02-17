import {
    DokumentasjonEtterspurt,
    DokumentasjonEtterspurtElement,
    Fil,
    InnsynsdataActionTypeKeys,
} from "../../../redux/innsynsdata/innsynsdataReducer";
import {useDispatch} from "react-redux";
import {
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../../redux/innsynsdata/innsynsDataActions";
import {logInfoMessage} from "../../../redux/innsynsdata/loggActions";
import {getVisningstekster} from "../../../utils/vedleggUtils";
import DokumentasjonEtterspurtElementView from "./DokumentasjonEtterspurtElementView";
import React from "react";
import {useDokumentasjonEtterspurtContext} from "./DokumentasjonEtterspurtContext";
import styles from "./dokumentasjonEtterspurt.module.css";
interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurt;
    oppgaveIndex: number;
}
const DokumentasjonEtterspurtElementer = (props: Props) => {
    const dispatch = useDispatch();
    const {dispatchDokEtterspurtState} = useDokumentasjonEtterspurtContext();

    const onAddFileChange = (
        files: FileList,
        internalIndex: number,
        oppgaveElement: DokumentasjonEtterspurtElement
    ) => {
        dispatch(setFileUploadFailed(props.dokumentasjonEtterspurt.oppgaveId, false));
        dispatch(setFileUploadFailedInBackend(props.dokumentasjonEtterspurt.oppgaveId, false));
        dispatch(setFileUploadFailedVirusCheckInBackend(props.dokumentasjonEtterspurt.oppgaveId, false));

        Array.from(files).forEach((file: File) => {
            if (!file) {
                logInfoMessage("Tom fil ble forsøkt lagt til i OppgaveView.VelgFil.onChange()");
            } else {
                dispatch({
                    type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                    internalIndex: internalIndex,
                    oppgaveElement: oppgaveElement,
                    externalIndex: props.oppgaveIndex,
                    fil: {
                        filnavn: file.name,
                        status: "INITIALISERT",
                        file: file,
                    },
                });
            }
        });
    };
    return (
        <ul className={styles.unorderedList}>
            {props.dokumentasjonEtterspurt.oppgaveElementer.map((oppgaveElement, oppgaveElementIndex) => {
                let {typeTekst, tilleggsinfoTekst} = getVisningstekster(
                    oppgaveElement.dokumenttype,
                    oppgaveElement.tilleggsinformasjon
                );

                const onDelete = (oppgaveId: string, vedleggIndex: number, fil: Fil) => {
                    dispatchDokEtterspurtState({
                        type: "overMaksStorrelse",
                        payload: false,
                    });
                    dispatch(setFileUploadFailedVirusCheckInBackend(oppgaveId, false));
                    dispatch({
                        type: InnsynsdataActionTypeKeys.FJERN_FIL_FOR_OPPLASTING,
                        vedleggIndex: vedleggIndex,
                        oppgaveElement: oppgaveElement,
                        internalIndex: oppgaveElementIndex,
                        externalIndex: props.oppgaveIndex,
                        fil: fil,
                    });
                };

                return (
                    <li>
                        <DokumentasjonEtterspurtElementView
                            key={oppgaveElementIndex}
                            tittel={typeTekst}
                            beskrivelse={tilleggsinfoTekst}
                            oppgaveElement={oppgaveElement}
                            oppgaveElementIndex={oppgaveElementIndex}
                            oppgaveId={props.dokumentasjonEtterspurt.oppgaveId}
                            onDelete={onDelete}
                            onAddFileChange={onAddFileChange}
                        />
                    </li>
                );
            })}
        </ul>
    );
};

export default DokumentasjonEtterspurtElementer;
