import { Alert, BodyLong, Heading, Link, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getFlag, getToggles } from "@featuretoggles/unleash";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";

import ProsessenVidere from "./_components/prosessenVidere";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    const t = await getTranslations("KlagePage");

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
                <Alert variant="info">
                    <Heading size="small" level="2" className="mb-2">
                        {t("underUtviklingInfo.tittel")}
                    </Heading>
                    <BodyLong className="mb-4">{t("underUtviklingInfo.beskrivelse1")}</BodyLong>
                    <BodyLong>
                        {t.rich("underUtviklingInfo.beskrivelse2", {
                            klageInfo: (chunks) => (
                                <Link href="https://www.nav.no/klagerettigheter" inlineText>
                                    {chunks}
                                </Link>
                            ),
                            navKontor: (chunks) => (
                                <Link href="https://www.nav.no/sok-nav-kontor" inlineText>
                                    {chunks}
                                </Link>
                            ),
                            tel: (chunks) => (
                                <Link href="tel:+4755553333" inlineText>
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </BodyLong>
                </Alert>
                <ProsessenVidere />
            </VStack>
        </>
    );
};

export const generateMetadata = async () => {
    const t = await getTranslations("KlagePage");
    return {
        title: t("tittel"),
        description: t("beskrivelse"),
    };
};

export default Page;
