import React, {ReactElement, useMemo} from "react";
import {DokumentasjonkravResponse} from "../../../generated/model";
import useKommune from "../../../hooks/useKommune";
import {useFileUploadAllowed} from "../../driftsmelding/DriftsmeldingUtilities";
import {useQueryClient} from "@tanstack/react-query";
import {getGetDokumentasjonkravQueryKey} from "../../../generated/oppgave-controller/oppgave-controller";
import useFiksDigisosId from "../../../hooks/useFiksDigisosId";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import useFilOpplasting, {errorStatusToMessage} from "../../filopplasting/useFilOpplasting";
import FilOpplastingBlokk from "../../filopplasting/FilOpplastingBlokk";
import InnsendelsesFrist from "../InnsendelsesFrist";
import AddFileButton from "../../filopplasting/AddFileButton";
import OppgaveOpplastingBlokk from "../OppgaveOpplastingBlokk";
import SendFileButton from "../../filopplasting/SendFileButton";
import styles from "../../../styles/lists.module.css";
import oppgaveStyles from "../oppgaver.module.css";

interface Props {
    dokumentasjonkrav: DokumentasjonkravResponse;
}

export const DokumentasjonKravView = ({dokumentasjonkrav}: Props): ReactElement => {
    const fiksDigisosId = useFiksDigisosId();
    const queryClient = useQueryClient();
    const {kommune} = useKommune();
    const {kanLasteOppVedlegg} = useFileUploadAllowed(kommune, fiksDigisosId);
    const metadatas = useMemo(
        () =>
            dokumentasjonkrav.dokumentasjonkravElementer.map((element) => ({
                type: element.tittel ?? "",
                tilleggsinfo: element.beskrivelse,
                innsendelsesfrist: dokumentasjonkrav.frist,
                hendelsetype: element.hendelsetype,
                hendelsereferanse: element.dokumentasjonkravReferanse,
            })),
        [dokumentasjonkrav]
    );

    const {
        upload,
        innerErrors,
        outerErrors,
        files,
        addFiler,
        removeFil,
        mutation: {isLoading},
        resetStatus,
    } = useFilOpplasting(metadatas, {
        onSuccess: () => {
            queryClient.invalidateQueries(getGetDokumentasjonkravQueryKey(fiksDigisosId));
        },
    });

    const onChange = (files: FileList | null, index: number) => {
        addFiler(index, files ? Array.from(files) : []);
    };

    return (
        <OppgaveOpplastingBlokk
            errors={outerErrors.map((it) => errorStatusToMessage[it.feil])}
            innsendelsesFrist={<InnsendelsesFrist frist={dokumentasjonkrav.frist} />}
            sendButton={
                <SendFileButton
                    isVisible={kanLasteOppVedlegg}
                    isLoading={isLoading}
                    onClick={() => {
                        logButtonOrLinkClick("Dine oppgaver: Trykket på Send vedlegg");
                        return upload();
                    }}
                />
            }
        >
            <ul className={styles.unorderedList}>
                {dokumentasjonkrav.dokumentasjonkravElementer.map((element, index) => {
                    if (index >= Object.keys(files).length) {
                        return <></>;
                    }

                    return (
                        <li key={element.dokumentasjonkravReferanse} className={oppgaveStyles.oppgaveElement}>
                            <FilOpplastingBlokk
                                tittel={element.tittel}
                                beskrivelse={element.beskrivelse}
                                errors={innerErrors[index]}
                                filer={files[index]}
                                onDelete={(_, file) => removeFil(index, file)}
                                addFileButton={
                                    kanLasteOppVedlegg ? (
                                        <AddFileButton
                                            onChange={(event) => {
                                                const files = event.currentTarget.files;
                                                onChange(files, index);
                                            }}
                                            id={element.dokumentasjonkravReferanse}
                                            resetStatus={resetStatus}
                                        />
                                    ) : undefined
                                }
                            />
                        </li>
                    );
                })}
            </ul>
        </OppgaveOpplastingBlokk>
    );
};

export default DokumentasjonKravView;
