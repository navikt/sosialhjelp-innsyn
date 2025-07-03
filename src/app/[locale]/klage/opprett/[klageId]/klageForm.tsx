"use client";

import { Button, Textarea } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const MAX_LEN_BACKGROUND = 1000;

type FormValues = {
    background: string | null;
};

const klageSchema = z.object({
    background: z.string().max(MAX_LEN_BACKGROUND, "validering.maksLengde").nullable(),
});

const KlageForm = () => {
    const t = useTranslations("KlageForm");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(klageSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-20">
            <Textarea
                label={t("backgroundLabel")}
                description={t("backgroundDescription")}
                error={errors.background?.message && t(errors.background.message)}
                {...register("background")}
            ></Textarea>
            <Button type="submit">Send klage</Button>
        </form>
    );
};

export default KlageForm;
