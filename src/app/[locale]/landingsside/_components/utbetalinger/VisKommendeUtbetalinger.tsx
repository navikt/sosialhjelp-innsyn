import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { ManedUtbetalingStatus } from "@generated/model";

import { getKommendeUtbetalinger } from "./getKommendeUtbetalinger";
import KommendeUtbetalingerListe from "./KommendeUtbetalingerListe";

const VisKommendeUtbetalinger = async () => {
    const t = await getTranslations("VisKommendeUtbetalinger");
    const kommendeUtbetalinger = await getKommendeUtbetalinger();

    const alleKommende = kommendeUtbetalinger
        .flatMap((gruppe) => gruppe.utbetalingerForManed)
        .filter(
            (utbetaling) =>
                utbetaling.status === ManedUtbetalingStatus.PLANLAGT_UTBETALING ||
                (utbetaling.forfallsdato && new Date(utbetaling.forfallsdato) >= new Date())
        );

    alleKommende.sort((a, b) => {
        if (!a.forfallsdato && !b.forfallsdato) return 0;
        if (!a.forfallsdato) return 1;
        if (!b.forfallsdato) return -1;

        return new Date(a.forfallsdato).getTime() - new Date(b.forfallsdato).getTime();
    });

    if (alleKommende.length === 0) {
        return null;
    }

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <VStack gap="4">
                <KommendeUtbetalingerListe alleKommende={alleKommende} />
            </VStack>
        </VStack>
    );
};

export default VisKommendeUtbetalinger;
