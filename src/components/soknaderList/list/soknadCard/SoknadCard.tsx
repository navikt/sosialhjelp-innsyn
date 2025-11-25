"use client";

import { useTranslations } from "next-intl";
import { Tag } from "@navikt/ds-react";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";

import { SaksDetaljerResponse } from "@generated/ssr/model";
import { SaksListeResponse } from "@generated/model";
import BehandlingsStatusTag from "@components/soknaderList/list/soknadCard/status/BehandlingStatusTag";

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

    if (sak.status === "MOTTATT") {
        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    {mottattDato ? (
                        <Tag variant="neutral-moderate" size="small">
                            {t("mottatt", { dato: mottattDato })}
                        </Tag>
                    ) : sendtDato ? (
                        <Tag variant="neutral-moderate" size="small">
                            {t("sendt", { dato: sendtDato })}
                        </Tag>
                    ) : null}
                    {!mottattDato && <BehandlingsStatusTag status="mottatt" />}
                </LinkCardFooter>
            </StatusCard>
        );
    }
    if (sak.status === "SENDT") {
        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    {mottattDato ? (
                        <Tag variant="neutral-moderate" size="small">
                            {t("mottatt", { dato: mottattDato })}
                        </Tag>
                    ) : sendtDato ? (
                        <Tag variant="neutral-moderate" size="small">
                            {t("sendt", { dato: sendtDato })}
                        </Tag>
                    ) : null}
                </LinkCardFooter>
            </StatusCard>
        );
    }
    if (sak.status === "UNDER_BEHANDLING") {
        const antallSaker = sak.saker?.length || 1;
        const ferdigeSaker = sak.saker?.filter((sak) => sak.status === "FERDIGBEHANDLET").length || 0;
        const vedtakProgress = antallSaker > 1 && ferdigeSaker > 0 ? { ferdigeSaker, antallSaker } : undefined;
        const antallNyeOppgaver = sak.antallNyeOppgaver ?? 0;

        return (
            <StatusCard id={id} tittel={sakTittel}>
                <LinkCardFooter>
                    {mottattDato ? (
                        <Tag variant="neutral-moderate" size="small">
                            {t("mottatt", { dato: mottattDato })}
                        </Tag>
                    ) : sendtDato ? (
                        <Tag variant="neutral-moderate" size="small">
                            {t("sendt", { dato: sendtDato })}
                        </Tag>
                    ) : null}
                    <BehandlingsStatusTag status="under_behandling" vedtakProgress={vedtakProgress} />
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
                    {mottattDato ? (
                        <Tag variant="neutral-moderate" size="small">
                            {t("mottatt", { dato: mottattDato })}
                        </Tag>
                    ) : sendtDato ? (
                        <Tag variant="neutral-moderate" size="small">
                            {t("sendt", { dato: sendtDato })}
                        </Tag>
                    ) : null}
                    <BehandlingsStatusTag
                        status={
                            ferdigbehandletAndOlderThan21Days(sak) ? "ferdigbehandlet_eldre" : "ferdigbehandlet_nylig"
                        }
                    />
                    {sak.vilkar && <AlertTag alertType="vilkaar" deadline={forsteOppgaveFrist} />}
                </LinkCardFooter>
            </StatusCard>
        );
    }

    return null;
};

export default SoknadCard;
