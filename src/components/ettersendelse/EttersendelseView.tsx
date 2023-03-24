import React from "react";
import useKommune from "../../hooks/useKommune";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {useQueryClient} from "@tanstack/react-query";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {getHentVedleggQueryKey} from "../../generated/vedlegg-controller/vedlegg-controller";
import {OppgaveElementHendelsetype} from "../../generated/model";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {useTranslation} from "react-i18next";
import VedleggSuccess from "../filopplasting/VedleggSuccess";
import {v4 as uuidv4} from "uuid";
import {BodyShort, Label} from "@navikt/ds-react";
import FilOpplastingBlokk from "../filopplasting/FilOpplastingBlokk";
import AddFileButton from "../filopplasting/AddFileButton";
import useFilOpplasting, {errorStatusToMessage} from "../filopplasting/useFilOpplasting";
import SendFileButton from "../filopplasting/SendFileButton";
import ErrorMessagePlaceholder, {ErrorMessage} from "../errors/ErrorMessage";
import styles from "../filopplasting/filopplasting.module.css";
import styled from "styled-components";
import {css} from "styled-components/macro";

const metadatas = [
    {
        type: "annet",
        tilleggsinfo: "annet",
        innsendelsesfrist: undefined,
        hendelsetype: OppgaveElementHendelsetype.bruker,
        hendelsereferanse: undefined,
    },
];

const OuterErrorBorder = styled.div<{hasError?: boolean}>`
    margin-bottom: 1rem;

    ${({hasError}) =>
        hasError &&
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
    const canUploadAttachments: boolean = isFileUploadAllowed(kommune);
    const {t} = useTranslation();

    const {
        upload,
        innerErrors,
        outerErrors,
        files: _files,
        addFiler,
        removeFil,
        mutation: {isLoading: uploadIsLoading},
        resetStatus,
        showSuccessAlert,
    } = useFilOpplasting(metadatas, {
        onSuccess: () => {
            queryClient.invalidateQueries(getHentVedleggQueryKey(fiksDigisosId));
        },
    });
    const files = _files[0];
    const firstInnerError = innerErrors[0];
    const uuid = uuidv4();

    const onChange = (files: FileList | null) => {
        addFiler(0, files ? Array.from(files) : []);
    };

    const errors = outerErrors.map((it) => errorStatusToMessage[it.feil]);
    const onClick = () => {
        logButtonOrLinkClick("Ettersendelse: Trykket på Send vedlegg");
        return upload();
    };
    const showLoadingState = props.isLoading || uploadIsLoading;
    return (
        <>
            <OuterErrorBorder hasError={outerErrors.length > 0}>
                <FilOpplastingBlokk
                    hasInnerErrors={innerErrors[0].length > 0}
                    innsendelsesFrist={
                        <div className={"tekst-wrapping"}>
                            <Label as="p">{t("andre_vedlegg.type")}</Label>
                            <BodyShort spacing>{t("andre_vedlegg.tilleggsinfo")}</BodyShort>
                        </div>
                    }
                    errors={firstInnerError}
                    filer={files}
                    onDelete={(_, file) => removeFil(0, file)}
                    addFileButton={
                        canUploadAttachments ? (
                            <AddFileButton
                                onChange={(event) => {
                                    const files = event.currentTarget.files;
                                    onChange(files);
                                }}
                                id={uuid}
                                resetStatus={resetStatus}
                            />
                        ) : undefined
                    }
                />
            </OuterErrorBorder>
            <ErrorMessagePlaceholder>
                {errors.map((error, index) => (
                    <ErrorMessage key={index} className={styles.outerError}>
                        {t(error)}
                    </ErrorMessage>
                ))}
            </ErrorMessagePlaceholder>
            <VedleggSuccess show={showSuccessAlert} />

            <SendFileButton isVisible={canUploadAttachments} isLoading={showLoadingState} onClick={onClick} />
        </>
    );
};

export default EttersendelseView;
