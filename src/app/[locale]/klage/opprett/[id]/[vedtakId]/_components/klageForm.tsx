"use client";

import { Alert, Button, FileObject, Textarea } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { logger } from "@navikt/next-logger";

import {
    getHentKlagerQueryKey,
    useLastOppVedlegg,
    useSendKlage,
} from "../../../../../../../generated/klage-controller/klage-controller";
import { MAX_LEN_BACKGROUND, MAX_FILES } from "../_consts/consts";

import FileUploadField from "./FileUploadField";

export type FormValues = {
    background: string | null;
    files: FileObject[];
};

const klageSchema = z.object({
    background: z.string().max(MAX_LEN_BACKGROUND, "validering.maksLengde").nullable(),
    files: z.array(z.any()).max(MAX_FILES, `Du kan laste opp maks ${MAX_FILES} filer`), //TODO: Translate this message (how to include variable?)
});

const KlageForm = () => {
    const t = useTranslations("KlageForm");
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { vedtakId } = useParams<{ vedtakId: string }>();
    const queryClient = useQueryClient();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(klageSchema) as Resolver<FormValues>,
        defaultValues: {
            background: "",
            files: [],
        },
    });

    const lastOppVedleggMutation = useLastOppVedlegg();
    const sendKlageMutation = useSendKlage();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const klageId = crypto.randomUUID();

            const files = data?.files?.map((file) => file.file);

            if (files.length > 0) {
                await lastOppVedleggMutation.mutateAsync({
                    fiksDigisosId,
                    klageId,
                    data: { files },
                });
            }

            await sendKlageMutation.mutateAsync({
                fiksDigisosId: fiksDigisosId,
                data: { klageId, vedtakId, klageTekst: data.background ?? "" },
            });

            await queryClient.invalidateQueries({ queryKey: getHentKlagerQueryKey(fiksDigisosId) });
            await router.push(`/klage/status/${klageId}/${vedtakId}`);
        } catch (error) {
            logger.error(`Opprett klage feilet ved sending til api ${error}, FiksDigisosId: ${fiksDigisosId}`);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-20">
            <Textarea
                label={t("bakgrunn.label")}
                description={t("bakgrunn.beskrivelse")}
                error={errors.background?.message && t(errors.background.message)}
                {...register("background")}
            />
            <FileUploadField name="files" control={control} />
            <Button loading={lastOppVedleggMutation.isPending || sendKlageMutation.isPending} type="submit">
                {t("sendKlage")}
            </Button>
            {(lastOppVedleggMutation.isError || sendKlageMutation.isError) && (
                <Alert variant="error">{t("sendingFeilet")}</Alert>
            )}
        </form>
    );
};

export default KlageForm;
