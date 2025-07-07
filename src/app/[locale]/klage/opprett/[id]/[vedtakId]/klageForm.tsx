"use client";

import { Alert, Button, Textarea } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import useFiksDigisosId from "../../../../../../hooks/useFiksDigisosId";
import { getHentKlagerQueryKey, useSendKlage } from "../../../../../../generated/klage-controller/klage-controller";
import useVedtakId from "../../../../../../hooks/useVedtakId";

const MAX_LEN_BACKGROUND = 1000;

type FormValues = {
    background: string | null;
};

const klageSchema = z.object({
    background: z.string().max(MAX_LEN_BACKGROUND, "validering.maksLengde").nullable(),
});

const KlageForm = () => {
    const t = useTranslations("KlageForm");
    const fiksDigisosId = useFiksDigisosId();
    const vedtakId = useVedtakId();
    const queryClient = useQueryClient();

    const [klageId] = useState(crypto.randomUUID());

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(klageSchema),
    });

    const {
        mutate,
        isPending: sendKlageIsLoading,
        isError,
    } = useSendKlage({
        mutation: {
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: getHentKlagerQueryKey(fiksDigisosId) });
                //await router.push({ pathname: "/[id]/status", query: { id: fiksDigisosId } });
            },
            // TODO: Logge ved feil
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        //TODO:
        mutate({
            fiksDigisosId: fiksDigisosId,
            data: { klageId, vedtakId, klageTekst: data.background ?? "" },
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-20">
            <Textarea
                label={t("bakgrunn.label")}
                description={t("bakgrunn.beskrivelse")}
                error={errors.background?.message && t(errors.background.message)}
                {...register("background")}
            ></Textarea>
            <Button loading={sendKlageIsLoading} type="submit">
                Send klage
            </Button>
            {isError && <Alert variant="error">{t("sendingFeilet")}</Alert>}
        </form>
    );
};

export default KlageForm;
