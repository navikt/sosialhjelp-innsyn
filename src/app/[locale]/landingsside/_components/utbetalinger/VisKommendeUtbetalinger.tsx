import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import {
    filtrerKommendeUtbetalinger,
    sorterUtbetalingerEtterForfallsdato,
} from "../../../utbetalinger/_utils/utbetalinger-utils";

import { getKommendeUtbetalinger } from "./getKommendeUtbetalinger";
import KommendeUtbetalingerListe from "./KommendeUtbetalingerListe";

const VisKommendeUtbetalinger = async () => {
    const t = await getTranslations("VisKommendeUtbetalinger");
    const kommendeUtbetalinger = await getKommendeUtbetalinger();

    const alleUtbetalinger = kommendeUtbetalinger.flatMap((gruppe) => gruppe.utbetalingerForManed);
    const alleKommende = sorterUtbetalingerEtterForfallsdato(filtrerKommendeUtbetalinger(alleUtbetalinger));

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
