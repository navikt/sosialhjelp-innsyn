"use client";

import { logger } from "@navikt/next-logger";

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
        if (sak.forelopigSvar?.harMottattForelopigSvar) {
            return <ForelopigSvarCard fiksDigisosId={sak.fiksDigisosId!} sakTittel={sak.soknadTittel} />;
        }
        return <UnderBehandlingCard sakTittel={sak.soknadTittel} fiksDigisosId={sak.fiksDigisosId!} />;
    }
    if (sak.status === "FERDIGBEHANDLET") {
        // TODO: Kan den være ferdigbehandlet uten vedtak?
        try {
            const count =
                sak.saker?.map((it) => it.antallVedtak).reduce((acc, antallVedtak) => acc + antallVedtak) ?? 0;
            if (sak.vilkar) {
                return (
                    <VilkarCard fiksDigisosId={sak.fiksDigisosId!} sakTittel={sak.soknadTittel} vedtakCount={count} />
                );
            }
            if (count > 0) {
                return (
                    <VedtakCard sakTittel={sak.soknadTittel} fiksDigisosId={sak.fiksDigisosId!} vedtakCount={count} />
                );
            }
        } catch (e: unknown) {
            logger.error(`Feil ved henting av vedtak for sak ${sak.fiksDigisosId}:`, e);
        }
    }
    return null;
};

export default SoknadCard;
