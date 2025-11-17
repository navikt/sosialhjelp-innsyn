"use client";

import { SaksDetaljerResponse } from "@generated/ssr/model";
import { SaksListeResponse } from "@generated/model";

import StatusCard from "./status/StatusCard";

interface Props {
    sak: Partial<SaksDetaljerResponse> & SaksListeResponse;
}

const SoknadCard = ({ sak }: Props) => {
    const sakTittel = sak.soknadTittel?.length ? sak.soknadTittel : "Søknad om økonomisk sosialhjelp";
    const id = sak.fiksDigisosId!;

    if ((sak.antallNyeOppgaver ?? 0) > 0) {
        const alertText = `Oppgaver med frist ${sak.forsteOppgaveFrist}`;
        return (
            <StatusCard
                id={id}
                tittel={sakTittel}
                sendtDato={new Date(sak.sistOppdatert)}
                behandlingsStatus="under_behandling"
                alertText={alertText}
            />
        );
    }
    if (sak.status === "MOTTATT") {
        return (
            <StatusCard
                id={id}
                tittel={sakTittel}
                sendtDato={new Date(sak.sistOppdatert)}
                behandlingsStatus="mottatt"
            />
        );
    }
    if (sak.status === "SENDT") {
        return <StatusCard id={id} tittel={sakTittel} sendtDato={new Date(sak.sistOppdatert)} />;
    }
    if (sak.status === "UNDER_BEHANDLING") {
        const alertText = sak.forelopigSvar?.harMottattForelopigSvar ? "Forlenget saksbehandlingstid" : undefined;
        return (
            <StatusCard
                id={id}
                tittel={sakTittel}
                sendtDato={new Date(sak.sistOppdatert)}
                behandlingsStatus="under_behandling"
                alertText={alertText}
            />
        );
    }
    if (sak.status === "FERDIGBEHANDLET") {
        //const count = sak.saker?.map((it) => it.antallVedtak).reduce((acc, antallVedtak) => acc + antallVedtak) ?? 0;

        let alertText;
        if (sak.vilkar) {
            alertText = sak.forsteOppgaveFrist ? "Vilkår" : `Vilkår med frist ${sak.forsteOppgaveFrist}`;
        }
        return (
            <StatusCard
                id={id}
                tittel={sakTittel}
                sendtDato={new Date(sak.sistOppdatert)}
                behandlingsStatus="ferdigbehandlet_nylig"
                alertText={alertText}
            />
        );
    }
    return null;
};

export default SoknadCard;
