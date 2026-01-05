import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getFlag, getToggles } from "@featuretoggles/unleash";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";

import { Soknad } from "./_components/Soknad";

export const dynamic = "force-dynamic";

const Page = async ({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_soknadside", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }
    const { id } = await params;

    const t = await getTranslations("StatusPage.breadcrumbs");

    return (
        <>
            <ClientBreadcrumbs
                dynamicBreadcrumbs={[
                    { title: t("soknader"), url: "/sosialhjelp/innsyn/soknader" },
                    { title: t("soknad") },
                ]}
            />
            <Soknad id={id} />
        </>
    );
};

export default Page;
