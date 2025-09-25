"use client";

import { Alert, Button, FileObject, Textarea } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logger } from "@navikt/next-logger";

import { getHentKlagerQueryKey, useUploadDocuments, useSendKlage } from "@generated/klage-controller/klage-controller";
import useFiles from "@components/filopplasting/new/useFiles";
import { createMetadataFile, formatFilesForUpload } from "@components/filopplasting/new/utils/formatFiles";
import FileSelect from "@components/filopplasting/new/FileSelect";

import { MAX_LEN_BACKGROUND, MAX_FILES } from "../_consts/consts";

export type FormValues = {
    background: string | null;
    files: FileObject[];
};

const klageSchema = z.object({
    background: z.string().max(MAX_LEN_BACKGROUND, "validering.maksLengde").nullable(),
    files: z.array(z.any()).max(MAX_FILES, `Du kan laste opp maks ${MAX_FILES} filer`), //TODO: Translate this message (how to include variable?)
});

const metadata = { type: "klage", tilleggsinfo: "klage" };

interface Props {
    fiksDigisosId: string;
    vedtakId: string;
}

const KlageForm = ({ fiksDigisosId, vedtakId }: Props) => {
    const t = useTranslations("KlageForm");
    const queryClient = useQueryClient();
    const router = useRouter();

    const { addFiler, files, removeFil, outerErrors } = useFiles();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(klageSchema),
        defaultValues: {
            background: "",
            files: [],
        },
    });

    const lastOppVedleggMutation = useUploadDocuments();
    const sendKlageMutation = useSendKlage();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const klageId = crypto.randomUUID();
            if (files.length > 0) {
                await lastOppVedleggMutation.mutateAsync({
                    fiksDigisosId,
                    klageId,
                    data: {
                        files: [createMetadataFile(files, metadata), ...formatFilesForUpload(files)],
                    },
                });
            }

            await sendKlageMutation.mutateAsync({
                fiksDigisosId: fiksDigisosId,
                data: { klageId, vedtakId, tekst: data.background ?? "" },
            });

            await queryClient.invalidateQueries({ queryKey: getHentKlagerQueryKey(fiksDigisosId) });
            await router.push(`/klage/status/${fiksDigisosId}/${vedtakId}`);
        } catch (error) {
            logger.error(`Opprett klage feilet ved sending til api ${error}, FiksDigisosId: ${fiksDigisosId}`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-20">
            <Textarea
                resize
                label={t("bakgrunn.label")}
                description={t("bakgrunn.beskrivelse")}
                error={errors.background?.message && t(errors.background.message)}
                {...register("background")}
            />
            <FileSelect
                files={files}
                addFiler={addFiler}
                removeFil={removeFil}
                outerErrors={outerErrors}
                filesLabel={t("filOpplasting.dineVedlegg")}
            />
            <div>
                <Button
                    loading={lastOppVedleggMutation.isPending || sendKlageMutation.isPending}
                    type="submit"
                    className="mb-4"
                >
                    {t("sendKlage")}
                </Button>
                {(lastOppVedleggMutation.isError || sendKlageMutation.isError) && (
                    <Alert variant="error">{t("sendingFeilet")}</Alert>
                )}
            </div>
        </form>
    );
};

export default KlageForm;
