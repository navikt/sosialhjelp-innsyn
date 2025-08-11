import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { hentAlleSaker } from "@generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { hentUtbetalinger } from "@generated/ssr/utbetalinger-controller/utbetalinger-controller";

import SoknaderSnarvei from "./SoknaderSnarvei";
import UtbetalingerSnarvei from "./UtbetalingerSnarvei";

const Snarveier = async () => {
    const [alleSakerResponse, utbetalingerResponse, t] = await Promise.all([
        hentAlleSaker(),
        hentUtbetalinger(),
        getTranslations("Snarveier"),
    ]);
    if (!utbetalingerResponse.length && !alleSakerResponse.length) {
        return null;
    }
    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            {alleSakerResponse.length > 0 && <SoknaderSnarvei />}
            {utbetalingerResponse.length > 0 && <UtbetalingerSnarvei />}
        </VStack>
    );
};

export default Snarveier;
