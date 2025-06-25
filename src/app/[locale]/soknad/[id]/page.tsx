import { notFound } from "next/navigation";

import { getFlag, getToggles } from "../../../../featuretoggles/unleash";
import { StatusSendtPage } from "../../../../components/statusPage/StatusSendtPage";
import { hentSoknadsStatus } from "../../../../generated/ssr/soknads-status-controller/soknads-status-controller";

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
    if (soknadsStatusResponse.data.status === "SENDT") {
        return <StatusSendtPage navKontor={soknadsStatusResponse.data.navKontor ?? "et navkontor"} />;
    }

    return notFound();
};

export default Page;
