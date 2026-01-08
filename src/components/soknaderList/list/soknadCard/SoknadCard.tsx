"use client";

import { useTranslations } from "next-intl";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";
import { SaksDetaljerResponse } from "@generated/ssr/model";
import { SaksListeResponse } from "@generated/model";
import BehandlingsStatusTag from "@components/soknaderList/list/soknadCard/status/BehandlingStatusTag";
import DatoTag from "@components/soknaderList/list/soknadCard/DatoTag";
import VedtakTag from "@components/soknaderList/list/soknadCard/VedtakTag";

import { ferdigbehandletAndOlderThan21Days } from "../soknaderUtils";

import StatusCard from "./status/StatusCard";
import AlertTag from "./status/AlertTag";

interface Props {
    soknad: Partial<SaksDetaljerResponse> & SaksListeResponse;
}

const SoknadCard = ({ soknad }: Props) => {
    const t = useTranslations("SoknadCard");
    const id = soknad.fiksDigisosId!;
    const sakTittel = soknad.soknadTittel?.length ? soknad.soknadTittel : t("defaultTittel");
    const sendtDato = soknad.soknadOpprettet ? new Date(soknad.soknadOpprettet) : undefined; // Kun satt ved digital søknad
    const mottattDato = soknad.mottattTidspunkt ? new Date(soknad.mottattTidspunkt) : undefined;
    const isDigitalSoknad = !!sendtDato;
    const forsteOppgaveFrist = soknad.forsteOppgaveFrist ? new Date(soknad.forsteOppgaveFrist) : undefined;
    const antallNyeOppgaver = soknad.antallNyeOppgaver ?? 0;
    const harSakMedFlereVedtak = soknad.saker?.some((s) => s.antallVedtak > 1) ?? false;

    if (soknad.status === "MOTTATT") {
        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                    {isDigitalSoknad && <BehandlingsStatusTag status="mottatt" />}
                    {antallNyeOppgaver > 0 && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
                </LinkCardFooter>
            </StatusCard>
        );
    }
    if (soknad.status === "SENDT") {
        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                    {antallNyeOppgaver > 0 && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
                </LinkCardFooter>
            </StatusCard>
        );
    }
    if (soknad.status === "UNDER_BEHANDLING") {
        const antallSaker = soknad.saker?.length || 1;
        const ferdigeSaker = soknad.saker?.filter((sak) => sak.status === "FERDIGBEHANDLET").length || 0;
        const vedtakProgress = antallSaker > 1 && ferdigeSaker > 0 ? { ferdigeSaker, antallSaker } : undefined;
        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                    <BehandlingsStatusTag status="under_behandling" vedtakProgress={vedtakProgress} />
                    {harSakMedFlereVedtak && <VedtakTag />}
                    {antallNyeOppgaver > 0 && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
                    {soknad.forelopigSvar?.harMottattForelopigSvar && <AlertTag alertType="forlenget_behandlingstid" />}
                </LinkCardFooter>
            </StatusCard>
        );
    }
    if (soknad.status === "FERDIGBEHANDLET") {
        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                    <BehandlingsStatusTag
                        status={
                            ferdigbehandletAndOlderThan21Days(soknad)
                                ? "ferdigbehandlet_eldre"
                                : "ferdigbehandlet_nylig"
                        }
                    />
                    {harSakMedFlereVedtak && <VedtakTag />}
                    {soknad.vilkar && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
                </LinkCardFooter>
            </StatusCard>
        );
    }

    return null;
};

export default SoknadCard;
