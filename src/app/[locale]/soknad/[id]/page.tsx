import { notFound } from "next/navigation";

import { getFlag, getToggles } from "../../../../featuretoggles/unleash";
import { StatusSendtPage } from "../../../../components/statusPage/StatusSendtPage";
import { hentSoknadsStatus } from "../../../../generated/ssr/soknads-status-controller/soknads-status-controller";
import { StatusMottattPage } from "../../../../components/statusPage/StatusMottattPage";
import { StatusUnderBehandlingPage } from "../../../../components/statusPage/StatusUnderBehandlingPage";
import { StatusFerdigbehandletPage } from "../../../../components/statusPage/StatusFerdigbehandletPage";

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
    if (soknadsStatusResponse.status === "SENDT") {
        return <StatusSendtPage navKontor={soknadsStatusResponse.navKontor ?? "et navkontor"} id={id} />;
    }

    if (soknadsStatusResponse.status === "MOTTATT") {
        return <StatusMottattPage navKontor={soknadsStatusResponse.navKontor ?? "et navkontor"} id={id} />;
    }

    if (soknadsStatusResponse.status === "UNDER_BEHANDLING") {
        return <StatusUnderBehandlingPage navKontor={soknadsStatusResponse.navKontor ?? "et navkontor"} id={id} />;
    }

    if (soknadsStatusResponse.status === "FERDIGBEHANDLET") {
        return <StatusFerdigbehandletPage id={id} />;
    }

    return notFound();
};

export default Page;
