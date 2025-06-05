import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { hentAlleSaker } from "../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { hentUtbetalinger } from "../../generated/ssr/utbetalinger-controller/utbetalinger-controller";
import { getFlag, getToggles } from "../../featuretoggles/unleash";

import SoknaderSnarvei from "./SoknaderSnarvei";
import UtbetalingerSnarvei from "./UtbetalingerSnarvei";
import KlagerSnarvei from "./KlagerSnarvei";

const Snarveier = async () => {
    const [alleSakerResponse, utbetalingerResponse, toggles, t] = await Promise.all([
        hentAlleSaker(),
        hentUtbetalinger(),
        getToggles(),
        getTranslations("Snarveier"),
    ]);
    const klageFlag = getFlag("sosialhjelp.innsyn.klage_enabled", toggles);
    if (!utbetalingerResponse.data.length && !alleSakerResponse.data.length && !klageFlag.enabled) {
        return null;
    }
    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            {alleSakerResponse.status === 200 && alleSakerResponse.data.length > 0 && <SoknaderSnarvei />}
            {utbetalingerResponse.status === 200 && utbetalingerResponse.data.length > 0 && <UtbetalingerSnarvei />}
            {klageFlag.enabled && <KlagerSnarvei />}
        </VStack>
    );
};

export default Snarveier;
