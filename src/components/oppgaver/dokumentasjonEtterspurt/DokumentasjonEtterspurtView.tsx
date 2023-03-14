import React, {ReactElement, useMemo} from "react";
import {getVisningstekster} from "../../../utils/vedleggUtils";
import {OppgaveResponse} from "../../../generated/model";
import useFilOpplasting, {errorStatusToMessage} from "../../../hooks/useFilOpplasting";
import OppgaveUploadBox from "../OppgaveUploadBox";
import UploadElementView from "../UploadElementView";
import useKommune from "../../../hooks/useKommune";
import {isFileUploadAllowed} from "../../driftsmelding/DriftsmeldingUtilities";
import {useQueryClient} from "@tanstack/react-query";
import {getGetOppgaverQueryKey} from "../../../generated/oppgave-controller/oppgave-controller";
import useFiksDigisosId from "../../../hooks/useFiksDigisosId";
import OppgaveElementUploadBox from "../OppgaveElementUploadBox";
import {logButtonOrLinkClick} from "../../../utils/amplitude";

interface Props {
    dokumentasjonEtterspurt: OppgaveResponse;
    showFrist: boolean;
}

export const DokumentasjonEtterspurtView = ({dokumentasjonEtterspurt, showFrist}: Props): ReactElement => {
    const fiksDigisosId = useFiksDigisosId();
    const {kommune} = useKommune();
    const canUploadAttachments: boolean = isFileUploadAllowed(kommune);
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
    } = useFilOpplasting(metadatas, {
        onSuccess: () => queryClient.invalidateQueries(getGetOppgaverQueryKey(fiksDigisosId)),
    });

    return (
        <OppgaveUploadBox
            onClick={() => {
                logButtonOrLinkClick("Dine oppgaver: Trykket på Send vedlegg");
                return upload();
            }}
            errors={outerErrors.map((it) => errorStatusToMessage[it.feil])}
            frist={showFrist ? dokumentasjonEtterspurt.innsendelsesfrist : undefined}
            showUploadButton={canUploadAttachments}
            isLoading={isLoading}
        >
            <>
                {dokumentasjonEtterspurt.oppgaveElementer.map((element, index) => {
                    const {typeTekst, tilleggsinfoTekst} = getVisningstekster(
                        element.dokumenttype,
                        element.tilleggsinformasjon
                    );
                    return (
                        <UploadElementView
                            key={index}
                            tittel={typeTekst}
                            beskrivelse={tilleggsinfoTekst}
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
                    );
                })}
            </>
        </OppgaveUploadBox>
    );
};

export default DokumentasjonEtterspurtView;
