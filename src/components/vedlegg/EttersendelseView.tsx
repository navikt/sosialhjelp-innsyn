import React, {ReactElement} from "react";
import useKommune from "../../hooks/useKommune";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import useFilOpplasting, {errorStatusToMessage} from "../../hooks/useFilOpplasting";
import OppgaveUploadBox from "../oppgaver/OppgaveUploadBox";
import {useQueryClient} from "@tanstack/react-query";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {getHentVedleggQueryKey} from "../../generated/vedlegg-controller/vedlegg-controller";
import UploadElementView from "../oppgaver/UploadElementView";
import OppgaveElementUploadBox from "../oppgaver/OppgaveElementUploadBox";
import {OppgaveElementHendelsetype} from "../../generated/model";
import {logButtonOrLinkClick} from "../../utils/amplitude";

interface Props {
    isLoading?: boolean;
}

const metadatas = [
    {
        type: "annet",
        tilleggsinfo: "annet",
        innsendelsesfrist: undefined,
        hendelsetype: OppgaveElementHendelsetype.bruker,
        hendelsereferanse: undefined,
    },
];

const EttersendelseView = ({isLoading}: Props): ReactElement => {
    const queryClient = useQueryClient();
    const fiksDigisosId = useFiksDigisosId();
    const {kommune} = useKommune();
    const canUploadAttachments: boolean = isFileUploadAllowed(kommune);

    const {
        upload,
        innerErrors,
        outerErrors,
        files: _files,
        addFiler,
        removeFil,
        mutation: {isLoading: uploadIsLoading},
    } = useFilOpplasting(metadatas, {
        onSuccess: () => queryClient.invalidateQueries(getHentVedleggQueryKey(fiksDigisosId)),
    });
    const files = _files[0];
    const errors = innerErrors[0];
    return (
        <OppgaveUploadBox
            onClick={() => {
                logButtonOrLinkClick("Ettersendelse: Trykket på Send vedlegg");
                return upload();
            }}
            errors={outerErrors.map((it) => errorStatusToMessage[it.feil])}
            showUploadButton={canUploadAttachments}
            isLoading={isLoading || uploadIsLoading}
            buttonDisabled={files.length === 0}
        >
            <>
                <UploadElementView
                    tittel={"Send andre vedlegg"}
                    beskrivelse={"Hvis du noe annet du vil sende, kan du laste det opp her."}
                    showAddFileButton={canUploadAttachments}
                    hasError={innerErrors[0].length > 0}
                    onChange={(files) => addFiler(0, files ? Array.from(files) : [])}
                    padTop={false}
                >
                    <OppgaveElementUploadBox errors={errors} files={files} onDelete={(file) => removeFil(0, file)} />
                </UploadElementView>
            </>
        </OppgaveUploadBox>
    );
};

export default EttersendelseView;
