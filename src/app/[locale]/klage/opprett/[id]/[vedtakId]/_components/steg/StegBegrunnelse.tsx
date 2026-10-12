"use client";

import { Button, HStack, Textarea, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormValues } from "../klageForm";
import FileSelectNew from "@components/filopplasting/FileSelectNew";
import { DocumentState, UploadState } from "@components/filopplasting/api/useDocumentState";

interface Props {
    contextId: string;
    vedtakId: string;
    klageId: string;
    docState: DocumentState;
    addUploads: (uploads: UploadState[]) => void;
    removeUpload: (correlationId: string) => void;
    onGaVidere: () => void;
    onForkastKlage: () => void;
}

const StegBegrunnelse = ({
    contextId,
    vedtakId,
    klageId,
    docState,
    addUploads,
    removeUpload,
    onGaVidere,
    onForkastKlage,
}: Props) => {
    const t = useTranslations("KlageForm");
    const {
        register,
        formState: { errors },
    } = useFormContext<FormValues>();

    return (
        <VStack gap="space-20">
            <Textarea
                id={"klageTextarea" + vedtakId}
                resize
                label={t("bakgrunn.label")}
                description={t("bakgrunn.beskrivelse")}
                error={errors.background?.message && t(errors.background.message)}
                {...register("background")}
            />
            <FileSelectNew
                label={t("filOpplasting.label")}
                target={{ type: "klage", klageId: klageId }}
                description={t("filOpplasting.beskrivelse")}
                docState={docState}
                contextId={contextId}
                onUploadsAdded={addUploads}
                onUploadRemoved={removeUpload}
            />
            <HStack gap="space-4">
                <Button type="button" onClick={onGaVidere} className="mb-4">
                    {t("gaVidereKnapp")}
                </Button>
                <Button onClick={onForkastKlage} type="button" className="mb-4" variant="tertiary">
                    {t("forkastKlageKnapp")}
                </Button>
            </HStack>
        </VStack>
    );
};

export default StegBegrunnelse;
