import { useTranslations } from "next-intl";
import { Accordion, BodyShort, Link as AkselLink } from "@navikt/ds-react";
import Link from "next/link";
import { FileTextIcon } from "@navikt/aksel-icons";

import type { ManedUtbetaling } from "../../generated/model";
import { formatDato } from "../../utils/formatting";
import { logButtonOrLinkClick } from "../../utils/amplitude";

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
    const { t, i18n } = useTranslation("utbetalinger");

    const utbetalingsmetodeTekst = !utbetalingsmetode
        ? null
        : i18n.exists(`utbetalingsmetode.${utbetalingsmetode?.toLowerCase()}`)
          ? i18n.t(`utbetalingsmetode.${utbetalingsmetode?.toLowerCase()}`)
          : utbetalingsmetode;

    return (
        <Accordion.Content className="pt-2">
            {fom && tom && (
                <>
                    <BodyShort className="font-bold">{t("periode")}</BodyShort>
                    <BodyShort spacing>
                        {formatDato(fom, i18n.language)} - {formatDato(tom, i18n.language)}
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
            <AkselLink
                as={Link}
                href={`/${fiksDigisosId}/status`}
                className="navds-link items-center gap-2 flex"
                onClick={() => logButtonOrLinkClick("Åpner søknaden fra utbetalingen")}
            >
                <FileTextIcon aria-hidden width="1.5rem" height="1.5rem" />
                {t("soknadLenke")}
            </AkselLink>
        </Accordion.Content>
    );
};
