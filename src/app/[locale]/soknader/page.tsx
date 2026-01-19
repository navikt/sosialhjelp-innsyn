import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import Footer from "@components/footer/Footer";
import Snarveier from "@components/snarveier/Snarveier";

import SoknaderSnarveier from "./_components/SoknaderSnarveier";
import Soknader from "@components/soknader/Soknader";

const Page = async () => {
    const t = await getTranslations("SoknaderSide");

    return (
        <>
            <ClientBreadcrumbs dynamicBreadcrumbs={[{ title: t("tittel") }]} />
            <VStack gap={{ xs: "12", md: "20" }} className="mt-6 md:mt-20">
                <Heading size="xlarge" level="1">
                    {t("tittel")}
                </Heading>

                <Soknader />
                <Snarveier>
                    <SoknaderSnarveier />
                </Snarveier>
                <Footer />
            </VStack>
        </>
    );
};

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("SoknaderSide");
    return {
        title: t("htmlTitle"),
    };
};

export default Page;
