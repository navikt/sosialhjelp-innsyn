"use client";

import { Alert, BodyLong, Button, FileObject, Modal, Textarea } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logger } from "@navikt/next-logger";

import { getHentKlagerQueryKey, useUploadDocuments, useSendKlage } from "@generated/klage-controller/klage-controller";
import useFiles from "@components/filopplasting/new/useFiles";
import { createMetadataFile, formatFilesForUpload } from "@components/filopplasting/new/utils/formatFiles";
import FileSelect from "@components/filopplasting/new/FileSelect";
import { Metadata } from "@components/filopplasting/new/types";

import { MAX_LEN_BACKGROUND, MAX_FILES } from "../_consts/consts";

export type FormValues = {
    background: string | null;
    files: FileObject[];
};

const klageSchema = z.object({
    background: z.string().max(MAX_LEN_BACKGROUND, "validering.maksLengde").nullable(),
    files: z.array(z.any()).max(MAX_FILES, `Du kan laste opp maks ${MAX_FILES} filer`), //TODO: Translate this message (how to include variable?)
});

const metadata = { dokumentKontekst: "klage", type: "klage", tilleggsinfo: "klage" } satisfies Metadata;

interface Props {
    fiksDigisosId: string;
    vedtakId: string;
}

const KlageForm = ({ fiksDigisosId, vedtakId }: Props) => {
    const t = useTranslations("KlageForm");
    const queryClient = useQueryClient();
    const router = useRouter();
    const [visBekreftForkastModal, setVisBekreftForkastModal] = useState(false);

    const { addFiler, files, removeFil, outerErrors } = useFiles();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
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
                    navEksternRefId: klageId,
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
            await router.push(`/klage/status/${fiksDigisosId}/${klageId}`);
        } catch (error) {
            logger.error(`Opprett klage feilet ved sending til api ${error}, FiksDigisosId: ${fiksDigisosId}`);
        }
    };
    const forkastKlageButtonEvent = () => {
        const background = getValues("background");
        const hasCharacters = !!background && background.trim().length > 0;

        if (files.length > 0 || hasCharacters) {
            setVisBekreftForkastModal(true);
        } else {
            forkastKlage();
        }
    };

    const forkastKlage = () => {
        setVisBekreftForkastModal(false);
        router.back();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-20">
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
                <div>
                    <Button
                        loading={lastOppVedleggMutation.isPending || sendKlageMutation.isPending}
                        type="submit"
                        className="mb-4"
                    >
                        {t("sendKlage")}
                    </Button>
                    <Button onClick={() => forkastKlageButtonEvent()} type="button" className="mb-4" variant="tertiary">
                        {t("forkastKlageKnapp")}
                    </Button>
                    {(lastOppVedleggMutation.isError || sendKlageMutation.isError) && (
                        <Alert variant="error">{t("sendingFeilet")}</Alert>
                    )}
                </div>
            </form>

            <Modal
                open={visBekreftForkastModal}
                onClose={() => setVisBekreftForkastModal(false)}
                header={{
                    heading: t("forkastKlageModalOverskrift"),
                    size: "small",
                    closeButton: false,
                }}
                width="small"
            >
                <Modal.Body className="py-4 px-5">
                    <BodyLong>{t("forkastKlageModalBeskrivelse")}</BodyLong>
                </Modal.Body>

                <Modal.Footer>
                    <Button type="button" variant="danger" onClick={() => forkastKlage()}>
                        {t("forkastKlageModalBekreft")}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setVisBekreftForkastModal(false)}>
                        {t("forkastKlageModalAvbryt")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default KlageForm;
