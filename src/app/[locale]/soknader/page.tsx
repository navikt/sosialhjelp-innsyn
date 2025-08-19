import { notFound } from "next/navigation";
import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getFlag, getToggles } from "@featuretoggles/unleash";
import AktiveSoknader from "@components/aktiveSoknader/AktiveSoknader";
import NyttigInformasjon from "@components/nyttigInformasjon/NyttigInformasjon";
import SokButton from "@components/sokButton/SokButton";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";

import TidligereSoknader from "./_components/TidligereSoknader";

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
                <SokButton />
                <NyttigInformasjon />
            </VStack>
        </>
    );
};

export default Page;
