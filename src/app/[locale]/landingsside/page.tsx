import { notFound } from "next/navigation";
import { Bleed, Heading, Show, Stack, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import OkonomiskSosialhjelpIcon from "@components/ikoner/OkonomiskSosialhjelp";
import { getFlag, getToggles } from "@featuretoggles/unleash";
import NyttigInformasjon from "@components/nyttigInformasjon/NyttigInformasjon";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import AktiveSoknader from "@components/aktiveSoknader/AktiveSoknader";
import { hentAlleSaker } from "@generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { hentUtbetalinger } from "@generated/ssr/utbetalinger-controller-2/utbetalinger-controller-2";
import Snarveier from "@components/snarveier/Snarveier";

import VisKommendeUtbetalinger from "./_components/utbetalinger/VisKommendeUtbetalinger";
import SoknaderSnarvei from "./_components/snarveier/SoknaderSnarvei";
import UtbetalingerSnarvei from "./_components/snarveier/UtbetalingerSnarvei";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_landingsside", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }
    const [alleSakerResponse, utbetalingerResponse, t] = await Promise.all([
        hentAlleSaker(),
        hentUtbetalinger(),
        getTranslations("Landingsside"),
    ]);
    return (
        <>
            <ClientBreadcrumbs />
            <VStack gap="20" className="mt-20">
                <Bleed marginInline={{ lg: "24" }} asChild>
                    <Stack
                        gap="4"
                        direction={{ sm: "row-reverse", lg: "row" }}
                        justify={{ sm: "space-between", lg: "start" }}
                        wrap={false}
                    >
                        <Show above="sm">
                            <OkonomiskSosialhjelpIcon className="mr-4" />
                        </Show>
                        <Heading size="xlarge" level="1">
                            {t("tittel")}
                        </Heading>
                    </Stack>
                </Bleed>
                <VisKommendeUtbetalinger />
                <AktiveSoknader />
                <Snarveier>
                    {alleSakerResponse.length > 0 && <SoknaderSnarvei />}
                    {utbetalingerResponse.length > 0 && <UtbetalingerSnarvei />}
                </Snarveier>
                <NyttigInformasjon />
            </VStack>
        </>
    );
};

export default Page;
