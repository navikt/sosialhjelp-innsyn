import { DateTimeFormatOptions, useFormatter, useTranslations } from "next-intl";
import { Accordion, BodyShort, Link as AkselLink } from "@navikt/ds-react";
import { FileTextIcon } from "@navikt/aksel-icons";
import Link from "next/link";

import type { ManedUtbetaling } from "../../generated/model";

export const UtbetalingAccordionContent = ({
    fom,
    tom,
    mottaker,
    annenMottaker,
    utbetalingsmetode,
    kontonummer,
    fiksDigisosId,
}: Pick<
    ManedUtbetaling,
    "fom" | "tom" | "mottaker" | "annenMottaker" | "utbetalingsmetode" | "kontonummer" | "fiksDigisosId"
>) => {
    const t = useTranslations("utbetalinger");
    const format = useFormatter();

    const utbetalingsmetodeTekst = !utbetalingsmetode
        ? null
        : t.has(`utbetalingsmetode.${utbetalingsmetode?.toLowerCase()}`)
          ? t(`utbetalingsmetode.${utbetalingsmetode?.toLowerCase()}`)
          : utbetalingsmetode;

    const dateFormat: DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    return (
        <Accordion.Content className="pt-2">
            {fom && tom && (
                <>
                    <BodyShort className="font-bold">{t("periode")}</BodyShort>
                    <BodyShort spacing>
                        {format.dateTime(new Date(fom), dateFormat)} - {format.dateTime(new Date(tom), dateFormat)}
                    </BodyShort>
                </>
            )}
            <BodyShort className="font-bold">{t("mottaker")}</BodyShort>
            {annenMottaker ? (
                <BodyShort className="capitalize" spacing>
                    {mottaker}
                </BodyShort>
            ) : (
                <BodyShort spacing>
                    {t("tilDeg")} {utbetalingsmetodeTekst} {kontonummer}
                </BodyShort>
            )}
            <AkselLink as={Link} href={`/${fiksDigisosId}/status`} className="navds-link items-center gap-2 flex">
                <FileTextIcon aria-hidden width="1.5rem" height="1.5rem" />
                {t("soknadLenke")}
            </AkselLink>
        </Accordion.Content>
    );
};
