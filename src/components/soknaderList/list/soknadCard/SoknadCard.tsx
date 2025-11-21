"use client";

import { useTranslations } from "next-intl";

import { SaksDetaljerResponse } from "@generated/ssr/model";
import { SaksListeResponse } from "@generated/model";

import { ferdigbehandletAndOlderThan21Days } from "../soknaderUtils";

import StatusCard from "./status/StatusCard";
import AlertTag from "./status/AlertTag";

interface Props {
    sak: Partial<SaksDetaljerResponse> & SaksListeResponse;
}

const SoknadCard = ({ sak }: Props) => {
    const t = useTranslations("Soknad");

    const id = sak.fiksDigisosId!;
    const sakTittel = sak.soknadTittel?.length ? sak.soknadTittel : t("defaultTittel");
    const sistOppdatert = new Date(sak.sistOppdatert);
    const forsteOppgaveFrist = sak.forsteOppgaveFrist ? new Date(sak.forsteOppgaveFrist) : undefined;

    if (sak.status === "MOTTATT") {
        return <StatusCard id={id} tittel={sakTittel} sendtDato={sistOppdatert} behandlingsStatus="mottatt" />;
    }
    if (sak.status === "SENDT") {
        return <StatusCard id={id} tittel={sakTittel} sendtDato={sistOppdatert} />;
    }
    if (sak.status === "UNDER_BEHANDLING") {
        const antallSaker = sak.saker?.length || 1;
        const ferdigeSaker = sak.saker?.filter((sak) => sak.status === "FERDIGBEHANDLET").length || 0;
        const vedtakProgress = antallSaker > 1 && ferdigeSaker > 0 ? { ferdigeSaker, antallSaker } : undefined;
        const antallNyeOppgaver = sak.antallNyeOppgaver ?? 0;

        const oppgaveAlert =
            antallNyeOppgaver > 0 ? <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} /> : undefined;
        const behandlingsTidAlert = sak.forelopigSvar?.harMottattForelopigSvar ? (
            <AlertTag alertType="forlenget_behandlingstid" />
        ) : undefined;

        return (
            <StatusCard
                id={id}
                tittel={sakTittel}
                sendtDato={sistOppdatert}
                behandlingsStatus="under_behandling"
                vedtakProgress={vedtakProgress}
                extraTags={[oppgaveAlert, behandlingsTidAlert]}
            />
        );
    }
    if (sak.status === "FERDIGBEHANDLET") {
        const vilkarAlert = sak.vilkar ? <AlertTag alertType="vilkaar" deadline={forsteOppgaveFrist} /> : undefined;

        return (
            <StatusCard
                id={id}
                tittel={sakTittel}
                sendtDato={sistOppdatert}
                behandlingsStatus={
                    ferdigbehandletAndOlderThan21Days(sak) ? "ferdigbehandlet_eldre" : "ferdigbehandlet_nylig"
                }
                extraTags={[vilkarAlert]}
            />
        );
    }

    return null;
};

export default SoknadCard;
