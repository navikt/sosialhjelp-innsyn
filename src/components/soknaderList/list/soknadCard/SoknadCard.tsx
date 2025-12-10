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
    sak: Partial<SaksDetaljerResponse> & SaksListeResponse;
}

const SoknadCard = ({ sak }: Props) => {
    const t = useTranslations("SoknadCard");

    const id = sak.fiksDigisosId!;
    const sakTittel = sak.soknadTittel?.length ? sak.soknadTittel : t("defaultTittel");
    const sendtDato = sak.soknadOpprettet ? new Date(sak.soknadOpprettet) : undefined;
    const mottattDato = sak.mottattTidspunkt ? new Date(sak.mottattTidspunkt) : undefined;
    const forsteOppgaveFrist = sak.forsteOppgaveFrist ? new Date(sak.forsteOppgaveFrist) : undefined;
    const antallNyeOppgaver = sak.antallNyeOppgaver ?? 0;
    const harSakMedFlereVedtak = sak.saker?.some((s) => s.antallVedtak > 1) ?? false;

    if (sak.status === "MOTTATT") {
        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                    {!mottattDato && <BehandlingsStatusTag status="mottatt" />}
                    {antallNyeOppgaver > 0 && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
                </LinkCardFooter>
            </StatusCard>
        );
    }
    if (sak.status === "SENDT") {
        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                    {antallNyeOppgaver > 0 && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
                </LinkCardFooter>
            </StatusCard>
        );
    }
    if (sak.status === "UNDER_BEHANDLING") {
        const antallSaker = sak.saker?.length || 1;
        const ferdigeSaker = sak.saker?.filter((sak) => sak.status === "FERDIGBEHANDLET").length || 0;
        const vedtakProgress = antallSaker > 1 && ferdigeSaker > 0 ? { ferdigeSaker, antallSaker } : undefined;

        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                    <BehandlingsStatusTag status="under_behandling" vedtakProgress={vedtakProgress} />
                    {harSakMedFlereVedtak && <VedtakTag />}
                    {antallNyeOppgaver > 0 && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
                    {sak.forelopigSvar?.harMottattForelopigSvar && <AlertTag alertType="forlenget_behandlingstid" />}
                </LinkCardFooter>
            </StatusCard>
        );
    }
    if (sak.status === "FERDIGBEHANDLET") {
        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    <DatoTag sendtDato={sendtDato} mottattDato={mottattDato} />
                    <BehandlingsStatusTag
                        status={
                            ferdigbehandletAndOlderThan21Days(sak) ? "ferdigbehandlet_eldre" : "ferdigbehandlet_nylig"
                        }
                    />
                    {harSakMedFlereVedtak && <VedtakTag />}
                    {sak.vilkar && <AlertTag alertType="oppgave" deadline={forsteOppgaveFrist} />}
                </LinkCardFooter>
            </StatusCard>
        );
    }

    return null;
};

export default SoknadCard;
