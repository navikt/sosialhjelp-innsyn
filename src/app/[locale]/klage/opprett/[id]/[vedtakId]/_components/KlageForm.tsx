"use client";

import { VStack } from "@navikt/ds-react";
import { FormProvider, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logger } from "@navikt/next-logger";
import { FilUrl } from "@generated/model";
import { getHentKlagerQueryKey, useSendKlage } from "@generated/klage-controller/klage-controller";

import { MAX_LEN_BACKGROUND } from "../_consts/consts";

import BekreftForkastModal from "./BekreftForkastModal";
import StegBegrunnelse from "./steg/StegBegrunnelse";
import StegOppsummering from "./steg/StegOppsummering";
import { useDocumentState } from "@components/filopplasting/api/useDocumentState";

export type FormValues = {
    background: string | null;
};

const klageSchema = z.object({
    background: z.string().max(MAX_LEN_BACKGROUND, "validering.maksLengde").nullable(),
});

interface Props {
    fiksDigisosId: string;
    vedtakId: string;
    klageId: string;
    vedtakMottatt: string;
    soknadSendt?: string | null;
    navKontor?: string | null;
    vedtaksbrev?: FilUrl;
}

const KlageForm = ({ fiksDigisosId, vedtakId, klageId, vedtaksbrev, navKontor, soknadSendt, vedtakMottatt }: Props) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [visBekreftForkastModal, setVisBekreftForkastModal] = useState(false);
    const [aktivtSteg, setAktivtSteg] = useState(1);
    const [isSending, startSending] = useTransition();

    const contextId = klageId;
    const { state: docState, addUploads, removeUpload } = useDocumentState(contextId);

    const formMethods = useForm<FormValues>({
        resolver: zodResolver(klageSchema),
        defaultValues: {
            background: "",
        },
    });
    const { handleSubmit, getValues, control } = formMethods;
    const background = useWatch({ control, name: "background" });
    const harInnhold = Boolean(background?.trim()) || (!!docState.uploads && docState.uploads.length > 0);

    const sendKlageMutation = useSendKlage();

    const onSubmit: SubmitHandler<FormValues> = (formValues: FormValues) => {
        startSending(async () => {
            try {
                await sendKlageMutation.mutateAsync({
                    fiksDigisosId: fiksDigisosId,
                    data: { klageId, vedtakId, tekst: formValues.background ?? "" },
                });

                await queryClient.invalidateQueries({ queryKey: getHentKlagerQueryKey(fiksDigisosId) });
                startSending(() => router.push(`/klage/kvittering/${fiksDigisosId}/${klageId}`));
            } catch (error) {
                logger.error(`Opprett klage feilet ved sending til api ${error}, FiksDigisosId: ${fiksDigisosId}`);
            }
        });
    };

    const forkastKlageButtonEvent = () => {
        if (harInnhold) {
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
                <FormProvider {...formMethods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-20">
                        {aktivtSteg === 1 && (
                            <StegBegrunnelse
                                vedtaksbrev={vedtaksbrev}
                                vedtaksDato={vedtakMottatt}
                                klageId={klageId}
                                contextId={contextId}
                                vedtakId={vedtakId}
                                docState={docState}
                                addUploads={addUploads}
                                removeUpload={removeUpload}
                                onGaVidere={handleSubmit(() => setAktivtSteg(2))}
                                onForkastKlage={forkastKlageButtonEvent}
                                harInnhold={harInnhold}
                            />
                        )}

                        {aktivtSteg === 2 && (
                            <StegOppsummering
                                isLoading={sendKlageMutation.isPending || isSending}
                                isError={sendKlageMutation.isError}
                                onTilbake={() => setAktivtSteg(1)}
                                formValues={getValues()}
                                uploads={(docState.uploads ?? []).filter((upload) => upload.status === "COMPLETE")}
                                otherInfo={{ navKontor, soknadSendt, vedtakMottatt }}
                            />
                        )}
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
