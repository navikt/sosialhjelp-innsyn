import { notFound } from "next/navigation";

import { getFlag, getToggles } from "@featuretoggles/unleash";
import { hentSoknadsStatus } from "@generated/ssr/soknads-status-controller/soknads-status-controller";

import { StatusPage } from "./_components/StatusPage";

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

    const soknadsStatusResponse = await hentSoknadsStatus(id);
    return (
        <StatusPage id={id} soknadstatus={soknadsStatusResponse.status} navKontor={soknadsStatusResponse.navKontor} />
    );
};

export default Page;
