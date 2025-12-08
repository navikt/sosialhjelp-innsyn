import { notFound } from "next/navigation";
import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getFlag, getToggles } from "@featuretoggles/unleash";
import AktiveSoknader from "@components/aktiveSoknader/AktiveSoknader";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import Footer from "@components/footer/Footer";
import Snarveier from "@components/snarveier/Snarveier";

import TidligereSoknader from "./_components/TidligereSoknader";
import SoknaderSnarveier from "./_components/SoknaderSnarveier";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_soknaderside", await getToggles());
    const t = await getTranslations("SoknaderSide");
    if (!toggle.enabled) {
        return notFound();
    }
    return (
        <>
            <ClientBreadcrumbs dynamicBreadcrumbs={[{ title: t("tittel") }]} />
            <VStack gap="20" className="mt-20">
                <Heading size="xlarge" level="1">
                    {t("tittel")}
                </Heading>

                <AktiveSoknader />
                <TidligereSoknader />
                <Snarveier>
                    <SoknaderSnarveier />
                </Snarveier>
                <Footer />
            </VStack>
        </>
    );
};

export default Page;
