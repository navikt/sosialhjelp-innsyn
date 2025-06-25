import { notFound } from "next/navigation";

import { getFlag, getToggles } from "../../../../featuretoggles/unleash";
import { StatusSendtPage } from "../../../../components/statusPage/StatusSendtPage";
import { hentSoknadsStatus } from "../../../../generated/ssr/soknads-status-controller/soknads-status-controller";

interface Props {
    params: {
        id: string;
    };
}

const Page = async ({ params }: Props) => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_soknadside", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }

    const soknadsStatusResponse = await hentSoknadsStatus(params.id);
    if (soknadsStatusResponse.data.status === "SENDT") {
        return <StatusSendtPage navKontor={soknadsStatusResponse.data.navKontor ?? "et navkontor"} />;
    }

    return notFound();
};

export default Page;
