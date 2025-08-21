import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getFlag, getToggles } from "@featuretoggles/unleash";
import { hentSoknadsStatus } from "@generated/ssr/soknads-status-controller/soknads-status-controller";
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
    const soknadsStatusResponse = await hentSoknadsStatus(id);
    return (
        <>
            <ClientBreadcrumbs
                dynamicBreadcrumbs={[
                    { title: t("soknader"), url: "/sosialhjelp/innsyn/soknader" },
                    { title: t("soknad") },
                ]}
            />
            <Soknad id={id} soknadstatus={soknadsStatusResponse.status} navKontor={soknadsStatusResponse.navKontor} />
        </>
    );
};

export default Page;
