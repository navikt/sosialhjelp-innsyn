import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import styled, { css } from "styled-components";
import { Alert, ErrorMessage } from "@navikt/ds-react";
import cx from "classnames";

import { useFileUploadError } from "../driftsmelding/lib/useFileUploadError";
import useFiksDigisosId from "../../hooks/useFiksDigisosIdDepricated";
import { getHentVedleggQueryKey } from "../../generated/vedlegg-controller/vedlegg-controller";
import { OppgaveElementHendelsetype } from "../../generated/model";
import VedleggSuccess from "../filopplasting/VedleggSuccess";
import FilOpplastingBlokk from "../filopplasting/FilOpplastingBlokk";
import AddFileButton from "../filopplasting/AddFileButton";
import useFilOpplasting, { errorStatusToMessage } from "../filopplasting/useFilOpplasting";
import SendFileButton from "../filopplasting/SendFileButton";
import ErrorMessageWrapper from "../errors/ErrorMessageWrapper";
import styles from "../filopplasting/filopplasting.module.css";
import { useFilUploadSuccessful } from "../filopplasting/FilUploadSuccessfulContext";
import { logAmplitudeEvent } from "../../utils/amplitude";
import useIsAalesundBlocked from "../../hooks/useIsAalesundBlocked";

const metadatas = [
    {
        type: "annet",
        tilleggsinfo: "annet",
        innsendelsesfrist: undefined,
        hendelsetype: OppgaveElementHendelsetype.bruker,
        hendelsereferanse: undefined,
    },
];

const OuterErrorBorder = styled.div<{ $hasError?: boolean }>`
    margin-bottom: 1rem;

    ${({ $hasError }) =>
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
    const fileUploadError = useFileUploadError();
    const t = useTranslations("common");
    const isAalesund = useIsAalesundBlocked();

    const {
        upload,
        innerErrors,
        outerErrors,
        files: _files,
        addFiler,
        removeFil,
        mutation: { isLoading: uploadIsLoading },
        resetStatus,
    } = useFilOpplasting(metadatas, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getHentVedleggQueryKey(fiksDigisosId) }),
    });
    const { ettersendelseUploadSuccess, setOppgaverUploadSuccess } = useFilUploadSuccessful();
    const files = _files[0];
    const outerErrorLocales = outerErrors.map((it) => errorStatusToMessage[it.feil]);

    const onChange = (files: FileList | null) => {
        addFiler(0, files ? Array.from(files) : []);
    };

    const onClick = () => {
        setOppgaverUploadSuccess(false);
        logAmplitudeEvent("Antall vedlegg som lastes opp under Dine vedlegg", { antallVedlegg: files.length });
        return upload();
    };
    const showLoadingState = props.isLoading || uploadIsLoading;

    return !!fileUploadError && !showLoadingState ? (
        <Alert variant="error" size="medium" inline className={cx("font-bold", styles.driftsmelding)}>
            {t(fileUploadError)}
        </Alert>
    ) : (
        <>
            <OuterErrorBorder $hasError={outerErrors.length > 0}>
                <FilOpplastingBlokk
                    beskrivelse={t("andre_vedlegg.tilleggsinfo")}
                    errors={innerErrors[0]}
                    filer={files}
                    onDelete={(_, file) => removeFil(0, file)}
                    addFileButton={
                        !fileUploadError ? (
                            <AddFileButton
                                onChange={(event) => {
                                    const files = event.currentTarget.files;
                                    onChange(files);
                                }}
                                id="ettersendelse_lastopp"
                                resetStatus={resetStatus}
                                disabled={isAalesund}
                                hasError={innerErrors[0]?.length + outerErrors.length > 0}
                                title={t("annen_dokumentasjon")}
                            />
                        ) : undefined
                    }
                />
            </OuterErrorBorder>

            <ErrorMessageWrapper>
                {outerErrorLocales.map((error, index) => (
                    <ErrorMessage key={index} className={styles.outerError}>
                        {t(error)}
                    </ErrorMessage>
                ))}
            </ErrorMessageWrapper>
            <SendFileButton
                isVisible={!fileUploadError}
                isLoading={showLoadingState}
                onClick={onClick}
                disabled={isAalesund || files?.length === 0 || innerErrors[0]?.length + outerErrors.length > 0}
            />
            <VedleggSuccess show={ettersendelseUploadSuccess} />
        </>
    );
};

export default EttersendelseView;
