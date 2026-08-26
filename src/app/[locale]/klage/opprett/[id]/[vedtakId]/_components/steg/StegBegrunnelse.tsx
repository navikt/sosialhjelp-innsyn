"use client";

import { Button, HStack, Textarea, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import FileSelect from "@components/filopplasting/FileSelect";
import useFiles from "@components/filopplasting/useFiles";

import { FormValues } from "../klageForm";

interface Props {
    vedtakId: string;
    files: ReturnType<typeof useFiles>["files"];
    addFiler: ReturnType<typeof useFiles>["addFiler"];
    removeFil: ReturnType<typeof useFiles>["removeFil"];
    outerErrors: ReturnType<typeof useFiles>["outerErrors"];
    onGaVidere: () => void;
    onForkastKlage: () => void;
}

const StegBegrunnelse = ({ vedtakId, files, addFiler, removeFil, outerErrors, onGaVidere, onForkastKlage }: Props) => {
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
            <FileSelect
                id={"klageVedlegg" + vedtakId}
                files={files}
                addFiler={addFiler}
                removeFil={removeFil}
                outerErrors={outerErrors}
                filesLabel={t("filOpplasting.dineVedlegg")}
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
