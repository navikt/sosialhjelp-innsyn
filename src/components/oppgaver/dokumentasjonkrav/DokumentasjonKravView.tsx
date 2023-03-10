import React, {ReactElement, useMemo} from "react";

import {DokumentasjonkravResponse} from "../../../generated/model";
import useFilOpplasting, {errorStatusToMessage} from "../../../hooks/useFilOpplasting";
import OppgaveUploadBox from "../OppgaveUploadBox";
import UploadElementView from "../UploadElementView";
import useKommune from "../../../hooks/useKommune";
import {isFileUploadAllowed} from "../../driftsmelding/DriftsmeldingUtilities";
import {useQueryClient} from "@tanstack/react-query";
import {getGetDokumentasjonkravQueryKey} from "../../../generated/oppgave-controller/oppgave-controller";
import useFiksDigisosId from "../../../hooks/useFiksDigisosId";
import styles from "../../../styles/lists.module.css";
import OppgaveElementUploadBox from "../OppgaveElementUploadBox";
import {logButtonOrLinkClick} from "../../../utils/amplitude";

interface Props {
    dokumentasjonkrav: DokumentasjonkravResponse;
}

export const DokumentasjonKravView = ({dokumentasjonkrav}: Props): ReactElement => {
    const fiksDigisosId = useFiksDigisosId();
    const queryClient = useQueryClient();
    const {kommune} = useKommune();
    const canUploadAttachments: boolean = isFileUploadAllowed(kommune);
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
        hasAnyError,
    } = useFilOpplasting(metadatas, {
        onSuccess: () => queryClient.invalidateQueries(getGetDokumentasjonkravQueryKey(fiksDigisosId)),
    });

    return (
        <OppgaveUploadBox
            onClick={() => {
                logButtonOrLinkClick("Dokumentasjonkrav: Trykket på Send vedlegg");
                return upload();
            }}
            hasError={hasAnyError}
            errors={outerErrors.map((it) => errorStatusToMessage[it.feil])}
            frist={dokumentasjonkrav.frist}
            showUploadButton={canUploadAttachments}
            isLoading={isLoading}
        >
            <ul className={styles.unorderedList}>
                {dokumentasjonkrav.dokumentasjonkravElementer.map((element, index) => (
                    <li key={index}>
                        <UploadElementView
                            tittel={element.tittel ?? ""}
                            beskrivelse={element.beskrivelse}
                            showAddFileButton={canUploadAttachments}
                            hasError={innerErrors[index].length > 0}
                            onChange={(files) => addFiler(index, files ? Array.from(files) : [])}
                        >
                            <OppgaveElementUploadBox
                                errors={innerErrors[index]}
                                files={files[index]}
                                onDelete={(file) => removeFil(index, file)}
                            />
                        </UploadElementView>
                    </li>
                ))}
            </ul>
        </OppgaveUploadBox>
    );
};

export default DokumentasjonKravView;
