import { notFound } from "next/navigation";
import { Bleed, Heading, Show, Stack, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import OkonomiskSosialhjelpIcon from "@components/ikoner/OkonomiskSosialhjelp";
import { getFlag, getToggles } from "@featuretoggles/unleash";
import Footer from "@components/footer/Footer";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import AktiveSoknader from "@components/aktiveSoknader/AktiveSoknader";
import Snarveier from "@components/snarveier/Snarveier";

import KommendeUtbetalinger from "./_components/utbetalinger/KommendeUtbetalinger";
import LandingssideSnarveier from "./_components/snarveier/LandingssideSnarveier";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_landingsside", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }
    const t = await getTranslations("Landingsside");
    return (
        <>
            <ClientBreadcrumbs />
            <VStack gap={{ xs: "12", md: "20" }} className="mt-6 md:mt-20">
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
                <KommendeUtbetalinger />
                <AktiveSoknader />
                <Snarveier>
                    <LandingssideSnarveier />
                </Snarveier>
                <Footer />
            </VStack>
        </>
    );
};

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("Landingsside");
    return {
        title: t("tittel"),
    };
};

export default Page;
