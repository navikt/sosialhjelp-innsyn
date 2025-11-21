import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getKommendeUtbetalinger } from "./getKommendeUtbetalinger";
import KommendeUtbetalingerListe from "./KommendeUtbetalingerListe";

const KommendeUtbetalinger = async () => {
    const t = await getTranslations("KommendeUtbetalinger");
    const alleKommende = await getKommendeUtbetalinger();

    if (alleKommende.length === 0) return null;

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <KommendeUtbetalingerListe alleKommende={alleKommende} />
        </VStack>
    );
};

export default KommendeUtbetalinger;
