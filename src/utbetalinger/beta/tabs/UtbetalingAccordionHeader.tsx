import { useTranslation } from "next-i18next";
import { Accordion, BodyShort } from "@navikt/ds-react";
import cx from "classnames";

import { ManedUtbetaling, ManedUtbetalingStatus } from "../../../generated/model";
import { formatCurrency, getDayAndMonth } from "../../../utils/formatting";
import { hentUtbetalingTittel } from "../../utbetalingerUtils";

export const UtbetalingAccordionHeader = ({
    tittel,
    belop,
    status,
    dato,
}: Pick<ManedUtbetaling, "tittel" | "belop" | "status" | "utbetalingsdato" | "forfallsdato"> & {
    dato: string | undefined;
}) => {
    const { t, i18n } = useTranslation("utbetalinger");

    const datoStreng = dato ? getDayAndMonth(dato, i18n.language) : t("ukjentDato");
    const erStoppet = status === ManedUtbetalingStatus.STOPPET;

    return (
        <Accordion.Header className="items-center">
            <div className="flex flex-row gap-2 items-center">
                <div className="flex flex-wrap gap-2 max-w-[80%]">
                    <BodyShort className="font-bold">
                        {hentUtbetalingTittel(tittel, t("default_utbetalinger_tittel"))}
                    </BodyShort>
                    <BodyShort>
                        {t(`utbetalingStatus.${status}` as const)} {erStoppet ? null : datoStreng}
                    </BodyShort>
                </div>

                <BodyShort className={cx("ml-auto", { "text-strikethrough text-text-subtle": erStoppet })}>
                    {!erStoppet && <span className="navds-sr-only">{t("opprinneligSum")}</span>}
                    {formatCurrency(belop, i18n.language)} kr
                </BodyShort>
            </div>
        </Accordion.Header>
    );
};
