import React, {useState} from "react";
import useKommune from "../../hooks/useKommune";
import {useFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {useQueryClient} from "@tanstack/react-query";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {getHentVedleggQueryKey} from "../../../generated/vedlegg-controller/vedlegg-controller";
import {OppgaveElementHendelsetype} from "../../../generated/model";
import {useTranslation} from "next-i18next";
import VedleggSuccess from "../filopplasting/VedleggSuccess";
import FilOpplastingBlokk from "../filopplasting/FilOpplastingBlokk";
import AddFileButton from "../filopplasting/AddFileButton";
import useFilOpplasting, {errorStatusToMessage} from "../filopplasting/useFilOpplasting";
import SendFileButton from "../filopplasting/SendFileButton";
import ErrorMessagePlaceholder, {ErrorMessage} from "../errors/ErrorMessage";
import styles from "../filopplasting/filopplasting.module.css";
import styled, {css} from "styled-components";
import {DriftsmeldingVedleggComponent} from "../driftsmelding/DriftsmeldingVedlegg";
import {useFilUploadSuccessful} from "../filopplasting/FilUploadSuccessfulContext";

const metadatas = [
    {
        type: "annet",
        tilleggsinfo: "annet",
        innsendelsesfrist: undefined,
        hendelsetype: OppgaveElementHendelsetype.bruker,
        hendelsereferanse: undefined,
    },
];

const OuterErrorBorder = styled.div<{$hasError?: boolean}>`
    margin-bottom: 1rem;

    ${({$hasError}) =>
        $hasError &&
        css`
            border-radius: 4px;
            border: 1px solid var(--a-red-500);
        `};
`;

interface Props {
    isLoading?: boolean;
}

const EttersendelseView = (props: Props) => {
    const queryClient = useQueryClient();
    const fiksDigisosId = useFiksDigisosId();
    const {kommune} = useKommune();
    const {kanLasteOppVedlegg, textKey} = useFileUploadAllowed(kommune, fiksDigisosId);
    const {t} = useTranslation();

    const [pressedAddFile, setPressedAddFile] = useState(false);
    const [pressedSendFile, setPressedSendFile] = useState(false);

    const {
        upload,
        innerErrors,
        outerErrors,
        files: _files,
        addFiler,
        removeFil,
        mutation: {isLoading: uploadIsLoading},
        resetStatus,
    } = useFilOpplasting(metadatas, {
        onSuccess: () => queryClient.invalidateQueries(getHentVedleggQueryKey(fiksDigisosId)),
    });
    const {ettersendelseUploadSuccess, setOppgaverUploadSuccess} = useFilUploadSuccessful();
    const files = _files[0];
    const outerErrorLocales = outerErrors.map((it) => errorStatusToMessage[it.feil]);

    const onChange = (files: FileList | null) => {
        console.log("files", files);
        addFiler(0, files ? Array.from(files) : []);
    };

    const onClick = () => {
        setOppgaverUploadSuccess(false);
        return upload();
    };
    const showLoadingState = props.isLoading || uploadIsLoading;

    return !kanLasteOppVedlegg && !showLoadingState ? (
        <DriftsmeldingVedleggComponent className={styles.driftsmelding} textKey={textKey} />
    ) : (
        <>
            <OuterErrorBorder $hasError={outerErrors.length > 0}>
                <FilOpplastingBlokk
                    tittel={t("andre_vedlegg.type")}
                    beskrivelse={t("andre_vedlegg.tilleggsinfo")}
                    errors={innerErrors[0]}
                    filer={files}
                    onDelete={(_, file) => removeFil(0, file)}
                    addFileButton={
                        kanLasteOppVedlegg ? (
                            <AddFileButton
                                onChange={(event) => {
                                    const files = event.currentTarget.files;
                                    onChange(files);
                                }}
                                id="ettersendelse_lastopp"
                                resetStatus={resetStatus}
                            />
                        ) : undefined
                    }
                />
            </OuterErrorBorder>

            <ErrorMessagePlaceholder>
                {outerErrorLocales.map((error, index) => (
                    <ErrorMessage key={index} className={styles.outerError}>
                        {t(error)}
                    </ErrorMessage>
                ))}
            </ErrorMessagePlaceholder>
            <SendFileButton isVisible={kanLasteOppVedlegg} isLoading={showLoadingState} onClick={onClick} />
            <VedleggSuccess show={ettersendelseUploadSuccess} />
        </>
    );
};

export default EttersendelseView;
