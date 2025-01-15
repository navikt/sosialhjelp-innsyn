import React, { ReactElement, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as R from "remeda";

import { DokumentasjonkravResponse } from "../../../generated/model";
import useKommune from "../../../hooks/useKommune";
import { useFileUploadAllowed } from "../../driftsmelding/useFileUploadAllowed";
import { getGetDokumentasjonkravQueryKey } from "../../../generated/oppgave-controller/oppgave-controller";
import useFiksDigisosId from "../../../hooks/useFiksDigisosId";
import useFilOpplasting, { errorStatusToMessage } from "../../filopplasting/useFilOpplasting";
import FilOpplastingBlokk from "../../filopplasting/FilOpplastingBlokk";
import InnsendelsesFrist from "../InnsendelsesFrist";
import AddFileButton from "../../filopplasting/AddFileButton";
import OppgaveOpplastingBlokk from "../OppgaveOpplastingBlokk";
import SendFileButton from "../../filopplasting/SendFileButton";
import styles from "../../../styles/lists.module.css";
import oppgaveStyles from "../oppgaver.module.css";
import { logButtonOrLinkClick } from "../../../utils/amplitude";
import useIsAalesundBlocked from "../../../hooks/useIsAalesundBlocked";

interface Props {
    dokumentasjonkrav: DokumentasjonkravResponse;
}

export const DokumentasjonKravView = ({ dokumentasjonkrav }: Props): ReactElement => {
    const fiksDigisosId = useFiksDigisosId();
    const queryClient = useQueryClient();
    const { kommune } = useKommune();
    const { textKey } = useFileUploadAllowed(kommune, fiksDigisosId);
    const isAalesund = useIsAalesundBlocked();
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
        mutation: { isLoading },
        resetStatus,
    } = useFilOpplasting(metadatas, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetDokumentasjonkravQueryKey(fiksDigisosId) });
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
                    isVisible={!textKey}
                    isLoading={isLoading}
                    onClick={() => {
                        logButtonOrLinkClick("Dine oppgaver - dokumentasjonkrav: Trykket på Send vedlegg");
                        return upload();
                    }}
                    disabled={isAalesund || R.flatten(Object.values(files)).length === 0}
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
                                    !textKey ? (
                                        <AddFileButton
                                            onChange={(event) => {
                                                const files = event.currentTarget.files;
                                                onChange(files, index);
                                            }}
                                            id={element.dokumentasjonkravReferanse}
                                            resetStatus={resetStatus}
                                            disabled={isAalesund}
                                            hasError={innerErrors[0]?.length + outerErrors.length > 0}
                                            title={element.tittel}
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
