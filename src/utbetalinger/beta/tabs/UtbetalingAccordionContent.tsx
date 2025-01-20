import { useTranslation } from "next-i18next";
import { Accordion, BodyShort } from "@navikt/ds-react";
import Link from "next/link";
import { FileTextIcon } from "@navikt/aksel-icons";

import type { ManedUtbetaling } from "../../../generated/model";
import { formatDato } from "../../../utils/formatting";
import { utbetalingsmetodeText } from "../../utbetalingerUtils";
import { logButtonOrLinkClick } from "../../../utils/amplitude";

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
                    {t("tilDeg")} {utbetalingsmetodeText(utbetalingsmetode, i18n)} {kontonummer}
                </BodyShort>
            )}

            <Link
                href={`/${fiksDigisosId}/status`}
                className="navds-link items-center gap-2 flex"
                onClick={() => logButtonOrLinkClick("Åpner søknaden fra utbetalingen")}
            >
                <FileTextIcon aria-hidden width="1.5rem" height="1.5rem" />
                {t("soknadLenke")}
            </Link>
        </Accordion.Content>
    );
};
