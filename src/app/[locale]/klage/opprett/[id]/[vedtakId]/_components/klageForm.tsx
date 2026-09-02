"use client";

import { Bleed, FileObject, Stepper, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logger } from "@navikt/next-logger";
import { getHentKlagerQueryKey, useUploadDocuments, useSendKlage } from "@generated/klage-controller/klage-controller";
import useFiles from "@components/filopplasting/useFiles";
import { createMetadataFile, formatFilesForUpload } from "@components/filopplasting/utils/formatFiles";
import { Metadata } from "@components/filopplasting/types";

import { MAX_LEN_BACKGROUND, MAX_FILES } from "../_consts/consts";

import BekreftForkastModal from "./BekreftForkastModal";
import StegBegrunnelse from "./steg/StegBegrunnelse";
import StegOppsummering from "./steg/StegOppsummering";
import StegKvittering from "./steg/StegKvittering";

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
    const [aktivtSteg, setAktivtSteg] = useState(1);

    const { addFiler, files, removeFil, outerErrors } = useFiles();

    const formMethods = useForm<FormValues>({
        resolver: zodResolver(klageSchema),
        defaultValues: {
            background: "",
            files: [],
        },
    });
    const { handleSubmit, getValues } = formMethods;

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
        const backgroundText = getValues("background");
        const hasCharacters = !!backgroundText && backgroundText.trim().length > 0;

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
            <VStack gap="space-12">
                <Bleed marginInline="full" reflectivePadding className="bg-ax-bg-neutral-soft py-5">
                    <Stepper
                        className="klage-stepper-accent"
                        activeStep={aktivtSteg}
                        onStepChange={setAktivtSteg}
                        orientation="horizontal"
                    >
                        <Stepper.Step interactive={aktivtSteg == 2} completed={aktivtSteg > 1}>
                            {t("steg.begrunnelse")}
                        </Stepper.Step>
                        <Stepper.Step interactive={false} completed={aktivtSteg > 2}>
                            {t("steg.oppsummering")}
                        </Stepper.Step>
                        <Stepper.Step interactive={false}>{t("steg.kvittering")}</Stepper.Step>
                    </Stepper>
                </Bleed>

                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-20">
                        {aktivtSteg === 1 && (
                            <StegBegrunnelse
                                vedtakId={vedtakId}
                                files={files}
                                addFiler={addFiler}
                                removeFil={removeFil}
                                outerErrors={outerErrors}
                                onGaVidere={handleSubmit(() => setAktivtSteg(2))}
                                onForkastKlage={forkastKlageButtonEvent}
                            />
                        )}

                        {aktivtSteg === 2 && (
                            <StegOppsummering
                                isLoading={lastOppVedleggMutation.isPending || sendKlageMutation.isPending}
                                isError={lastOppVedleggMutation.isError || sendKlageMutation.isError}
                                onTilbake={() => setAktivtSteg(1)}
                            />
                        )}

                        {aktivtSteg === 3 && <StegKvittering />}
                    </form>
                </FormProvider>
            </VStack>

            <BekreftForkastModal
                open={visBekreftForkastModal}
                onClose={() => setVisBekreftForkastModal(false)}
                forkastKlage={forkastKlage}
            />
        </>
    );
};

export default KlageForm;
