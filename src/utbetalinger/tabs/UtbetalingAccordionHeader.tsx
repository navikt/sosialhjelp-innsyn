import { useFormatter, useTranslations } from "next-intl";
import { Accordion, BodyShort } from "@navikt/ds-react";
import cx from "classnames";

import { ManedUtbetaling, ManedUtbetalingStatus } from "../../generated/model";

export const UtbetalingAccordionHeader = ({
    tittel,
    belop,
    status,
    dato,
}: Pick<ManedUtbetaling, "tittel" | "belop" | "status" | "utbetalingsdato" | "forfallsdato"> & {
    dato: string | undefined;
}) => {
    const t = useTranslations("utbetalinger");
    const format = useFormatter();

    const datoStreng = dato
        ? format.dateTime(new Date(dato), {
              day: "numeric",
              month: "long",
          })
        : t("ukjentDato");
    const erStoppet = status === ManedUtbetalingStatus.STOPPET;
    const tittelOrDefault = "default_utbetalinger_tittel" !== tittel ? tittel : t("default_utbetalinger_tittel");

    return (
        <Accordion.Header className="items-center [&>.navds-heading]:grow">
            <div className="flex flex-row gap-2 justify-between">
                <div className="flex flex-wrap grow gap-2">
                    <BodyShort className="font-bold">{tittelOrDefault}</BodyShort>
                    <BodyShort>
                        {t(`utbetalingStatus.${status}` as const)} {erStoppet ? null : datoStreng}
                    </BodyShort>
                </div>

                <BodyShort className={cx({ "!text-strikethrough text-text-subtle": erStoppet })}>
                    {!erStoppet && <span className="navds-sr-only">{t("opprinneligSum")}</span>}
                    {format.number(belop)} kr
                </BodyShort>
            </div>
        </Accordion.Header>
    );
};
