import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getKommendeUtbetalinger } from "./getKommendeUtbetalinger";
import KommendeUtbetalingerListe from "./KommendeUtbetalingerListe";

const sorterEtterForfallsdato = (a: { forfallsdato?: string }, b: { forfallsdato?: string }) => {
    if (!a.forfallsdato && !b.forfallsdato) return 0;
    if (!a.forfallsdato) return 1;
    if (!b.forfallsdato) return -1;
    return new Date(a.forfallsdato).getTime() - new Date(b.forfallsdato).getTime();
};

const VisKommendeUtbetalinger = async () => {
    const t = await getTranslations("VisKommendeUtbetalinger");
    const kommendeUtbetalinger = await getKommendeUtbetalinger();

    const alleKommende = kommendeUtbetalinger
        .flatMap((gruppe) => gruppe.utbetalingerForManed)
        .sort(sorterEtterForfallsdato);

    if (alleKommende.length === 0) return null;

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
