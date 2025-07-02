"use client";

import { SaksDetaljerResponse } from "../../../../generated/ssr/model";
import { SaksListeResponse } from "../../../../generated/model";

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

const SoknadCard = ({ sak }: Props) => {
    const sakTittel = sak.soknadTittel?.length ? sak.soknadTittel : "Søknad om økonomisk sosialhjelp";
    if ((sak.antallNyeOppgaver ?? 0) > 0) {
        return <OppgaveCard fiksDigisosId={sak.fiksDigisosId!} sakTittel={sakTittel} frist={sak.forsteOppgaveFrist} />;
    }
    if (sak.status === "MOTTATT") {
        return <MottattCard fiksDigisosId={sak.fiksDigisosId!} mottattDato={new Date(sak.sistOppdatert)} />;
    }
    if (sak.status === "SENDT") {
        return <SendtCard fiksDigisosId={sak.fiksDigisosId!} sendtDato={new Date(sak.sistOppdatert)} />;
    }
    if (sak.status === "UNDER_BEHANDLING") {
        if (sak.forelopigSvar?.harMottattForelopigSvar) {
            return <ForelopigSvarCard fiksDigisosId={sak.fiksDigisosId!} sakTittel={sakTittel} />;
        }
        return <UnderBehandlingCard sakTittel={sakTittel} fiksDigisosId={sak.fiksDigisosId!} />;
    }
    if (sak.status === "FERDIGBEHANDLET") {
        // TODO: Kan den være ferdigbehandlet uten vedtak?
        const count = sak.saker?.map((it) => it.antallVedtak).reduce((acc, antallVedtak) => acc + antallVedtak) ?? 0;
        if (sak.vilkar) {
            return <VilkarCard fiksDigisosId={sak.fiksDigisosId!} sakTittel={sakTittel} vedtakCount={count} />;
        }
        if (count > 0) {
            return <VedtakCard sakTittel={sakTittel} fiksDigisosId={sak.fiksDigisosId!} vedtakCount={count} />;
        }
    }
    return null;
};

export default SoknadCard;
