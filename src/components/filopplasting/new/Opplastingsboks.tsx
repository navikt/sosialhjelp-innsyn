"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyShort, Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { useNavigationGuard } from "next-navigation-guard";

import useSendVedleggHelper from "@components/filopplasting/new/mutations/useSendVedleggHelper";
import useFiles from "@components/filopplasting/new/useFiles";
import { Metadata } from "@components/filopplasting/new/types";
import { errorStatusToMessage } from "@components/filopplasting/new/utils/mapErrors";

import FileSelect from "./FileSelect";

interface Props {
    metadata: Metadata;
    label?: string;
    description?: ReactNode;
    tag?: ReactNode;
    completed?: boolean;
}

const Opplastingsboks = ({ metadata, label, description, tag, completed }: Props) => {
    const t = useTranslations();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { addFiler, files, removeFil, outerErrors, reset: resetFilOpplastningData } = useFiles();
    const {
        upload,
        resetMutation,
        errors: mutationErrors,
        isPending,
        isUploadSuccess,
    } = useSendVedleggHelper(fiksDigisosId, resetFilOpplastningData);

    useNavigationGuard({
        enabled: files.length > 0,
        confirm: () => {
            return window.confirm(t("common.varsling.forlater_siden_uten_aa_sende_inn_vedlegg"));
        },
    });

    const onFilesSelect = (newFiles: File[]) => {
        addFiler(newFiles);
        resetMutation();
    };

    if (completed) {
        return (
            <VStack gap="2">
                <Box.New>
                    <HStack align="center" justify="space-between">
                        <Heading size="small" level="3" lang="no">
                            {label ?? t("Opplastingsboks.tittel")}
                        </Heading>
                        {tag}
                    </HStack>
                    <BodyShort>{description ?? t("Opplastingsboks.beskrivelse")}</BodyShort>
                </Box.New>
                {isUploadSuccess && (
                    <Alert closeButton onClose={resetMutation} variant="success">
                        {t("common.vedlegg.suksess")}
                    </Alert>
                )}
            </VStack>
        );
    }

    return (
        <>
            <FileSelect
                label={label}
                description={description}
                tag={tag}
                files={files}
                addFiler={onFilesSelect}
                removeFil={removeFil}
                outerErrors={outerErrors}
            />
            <Button
                disabled={Object.values(files).flat().length === 0}
                onClick={() => upload(files, metadata)}
                loading={isPending}
                className="self-start"
            >
                {t("Opplastingsboks.sendInn")}
            </Button>
            {isUploadSuccess && <Alert variant="success">{t("common.vedlegg.suksess")}</Alert>}
            {mutationErrors.length > 0 && (
                <Alert variant="error">{t(`common.${errorStatusToMessage[mutationErrors[0].feil]}`)}</Alert>
            )}
        </>
    );
};

export default Opplastingsboks;
