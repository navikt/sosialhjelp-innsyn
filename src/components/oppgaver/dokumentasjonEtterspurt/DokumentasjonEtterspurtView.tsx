import React, {ReactElement, useMemo} from "react";
import {getVisningstekster} from "../../../utils/vedleggUtils";
import useKommune from "../../../hooks/useKommune";
import {useFileUploadAllowed} from "../../driftsmelding/DriftsmeldingUtilities";
import {useQueryClient} from "@tanstack/react-query";
import {getGetOppgaverQueryKey} from "../../../generated/oppgave-controller/oppgave-controller";
import useFiksDigisosId from "../../../hooks/useFiksDigisosId";
import FilOpplastingBlokk from "../../filopplasting/FilOpplastingBlokk";
import useFilOpplasting, {errorStatusToMessage} from "../../filopplasting/useFilOpplasting";
import InnsendelsesFrist from "../InnsendelsesFrist";
import AddFileButton from "../../filopplasting/AddFileButton";
import OppgaveOpplastingBlokk from "../OppgaveOpplastingBlokk";
import SendFileButton from "../../filopplasting/SendFileButton";
import {DokumentasjonEtterspurtResponse} from "../../../hooks/useDokumentasjonEtterspurt";
import styles from "../../../styles/lists.module.css";
import oppgaveStyles from "../oppgaver.module.css";
import {logButtonOrLinkClick} from "../../../utils/amplitude";

interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurtResponse;
    showFrist: boolean;
}

export const DokumentasjonEtterspurtView = ({dokumentasjonEtterspurt, showFrist}: Props): ReactElement => {
    const fiksDigisosId = useFiksDigisosId();
    const {kommune} = useKommune();
    const {kanLasteOppVedlegg} = useFileUploadAllowed(kommune, fiksDigisosId);
    const metadatas = useMemo(
        () =>
            dokumentasjonEtterspurt.oppgaveElementer.map((element) => ({
                type: element.dokumenttype,
                tilleggsinfo: element.tilleggsinformasjon,
                innsendelsesfrist: dokumentasjonEtterspurt.innsendelsesfrist,
                hendelsetype: element.hendelsetype,
                hendelsereferanse: element.hendelsereferanse,
            })),
        [dokumentasjonEtterspurt]
    );
    const queryClient = useQueryClient();

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
            queryClient.invalidateQueries({queryKey: getGetOppgaverQueryKey(fiksDigisosId)});
        },
    });

    const onChange = (files: FileList | null, index: number) => {
        addFiler(index, files ? Array.from(files) : []);
    };

    return (
        <OppgaveOpplastingBlokk
            errors={outerErrors.map((it) => errorStatusToMessage[it.feil])}
            innsendelsesFrist={
                showFrist ? <InnsendelsesFrist frist={dokumentasjonEtterspurt.innsendelsesfrist} /> : undefined
            }
            sendButton={
                <SendFileButton
                    isVisible={kanLasteOppVedlegg}
                    isLoading={isLoading}
                    onClick={() => {
                        logButtonOrLinkClick("Dine oppgaver - dokumentasjonEtterspurt: Trykket på Send vedlegg");
                        return upload();
                    }}
                />
            }
        >
            <ul className={styles.unorderedList}>
                {dokumentasjonEtterspurt.oppgaveElementer.map((element, index) => {
                    if (index >= Object.keys(files).length) {
                        return <></>;
                    }

                    const {typeTekst, tilleggsinfoTekst} = getVisningstekster(
                        element.dokumenttype,
                        element.tilleggsinformasjon
                    );

                    return (
                        <li key={element.id} className={oppgaveStyles.oppgaveElement}>
                            <FilOpplastingBlokk
                                tittel={typeTekst}
                                beskrivelse={tilleggsinfoTekst}
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
                                            id={element.id}
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

export default DokumentasjonEtterspurtView;
