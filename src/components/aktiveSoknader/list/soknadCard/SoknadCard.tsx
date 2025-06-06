import { SaksDetaljerResponse } from "../../../../generated/ssr/model";
import { SaksListeResponse } from "../../../../generated/model";
import { hentForelopigSvarStatus } from "../../../../generated/ssr/forelopig-svar-controller/forelopig-svar-controller";
import { hentSaksStatuser } from "../../../../generated/ssr/saks-status-controller/saks-status-controller";

import MottattCard from "./status/MottattCard";
import SendtCard from "./status/SendtCard";
import UnderBehandlingCard from "./status/UnderBehandlingCard";
import VilkarCard from "./status/VilkarCard";
import OppgaveCard from "./status/OppgaveCard";
import ForelopigSvarCard from "./status/ForelopigSvarCard";
import VedtakCard from "./status/VedtakCard";

interface Props {
    sak: Partial<SaksDetaljerResponse> & SaksListeResponse;
}

const SoknadCard = async ({ sak }: Props) => {
    if ((sak.antallNyeOppgaver ?? 0) > 0) {
        return <OppgaveCard fiksDigisosId={sak.fiksDigisosId!} sakTittel={sak.soknadTittel} />;
    }
    if (sak.status === "MOTTATT") {
        return <MottattCard fiksDigisosId={sak.fiksDigisosId!} mottattDato={new Date(sak.sistOppdatert)} />;
    }
    if (sak.status === "SENDT") {
        return <SendtCard fiksDigisosId={sak.fiksDigisosId!} sendtDato={new Date(sak.sistOppdatert)} />;
    }
    if (sak.status === "UNDER_BEHANDLING") {
        const forelopigSvarResponse = await hentForelopigSvarStatus(sak.fiksDigisosId!);
        if (forelopigSvarResponse.status === 200 && forelopigSvarResponse.data.harMottattForelopigSvar) {
            return <ForelopigSvarCard fiksDigisosId={sak.fiksDigisosId!} sakTittel={sak.soknadTittel} />;
        }
        return <UnderBehandlingCard sakTittel={sak.soknadTittel} fiksDigisosId={sak.fiksDigisosId!} />;
    }
    if (sak.status === "FERDIGBEHANDLET") {
        // TODO: Kan den være ferdigbehandlet uten vedtak?
        const vedtakResponse = await hentSaksStatuser(sak.fiksDigisosId!);

        if (vedtakResponse.status === 200) {
            const count = vedtakResponse.data.flatMap((it) => it.vedtaksfilUrlList).length;
            if (sak.vilkar) {
                return (
                    <VilkarCard fiksDigisosId={sak.fiksDigisosId!} sakTittel={sak.soknadTittel} vedtakCount={count} />
                );
            }
            if (vedtakResponse.data.some((it) => it.skalViseVedtakInfoPanel)) {
                return (
                    <VedtakCard sakTittel={sak.soknadTittel} fiksDigisosId={sak.fiksDigisosId!} vedtakCount={count} />
                );
            }
        }
    }
    return null;
};

export default SoknadCard;
