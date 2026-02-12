import { Bleed, Heading, Show, Stack, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import OkonomiskSosialhjelpIcon from "@components/ikoner/OkonomiskSosialhjelp";
import Footer from "@components/footer/Footer";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import Snarveier from "@components/snarveier/Snarveier";

import KommendeUtbetalinger from "./_components/utbetalinger/KommendeUtbetalinger";
import LandingssideSnarveier from "./_components/snarveier/LandingssideSnarveier";
import Soknader from "@components/soknader/Soknader";

const Page = async () => {
    const t = await getTranslations("Landingsside");
    return (
        <>
            <ClientBreadcrumbs />
            <VStack gap={{ xs: "12", md: "20" }} className="mt-6 ax-md:mt-20">
                <Bleed marginInline={{ lg: "24" }} asChild>
                    <Stack
                        gap="4"
                        direction={{ sm: "row-reverse", lg: "row" }}
                        justify={{ sm: "space-between", lg: "start" }}
                        wrap={false}
                    >
                        <Show above="sm">
                            <OkonomiskSosialhjelpIcon className="mr-4" aria-hidden />
                        </Show>
                        <Heading size="xlarge" level="1">
                            {t("tittel")}
                        </Heading>
                    </Stack>
                </Bleed>
                <KommendeUtbetalinger />
                <Soknader hideInactive />

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
