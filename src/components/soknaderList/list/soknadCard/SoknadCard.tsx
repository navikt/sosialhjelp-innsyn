"use client";

import { useTranslations } from "next-intl";

import { SaksDetaljerResponse } from "@generated/ssr/model";
import { SaksListeResponse } from "@generated/model";

import StatusCard from "./status/StatusCard";

interface Props {
    sak: Partial<SaksDetaljerResponse> & SaksListeResponse;
}

const SoknadCard = ({ sak }: Props) => {
    const tSoknad = useTranslations("Soknad");
    const t = useTranslations();
    const sakTittel = sak.soknadTittel?.length ? sak.soknadTittel : tSoknad("defaultTittel");
    const id = sak.fiksDigisosId!;
    const sistOppdatert = new Date(sak.sistOppdatert);

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

        const alertTexts = [];
        if ((sak.antallNyeOppgaver ?? 0) > 0) {
            alertTexts.push(
                sak.forsteOppgaveFrist
                    ? t("StatusCard.AlertTexts.oppgaveMedFrist", { frist: new Date(sak.forsteOppgaveFrist) })
                    : t("StatusCard.AlertTexts.oppgaver")
            );
        }
        if (sak.forelopigSvar?.harMottattForelopigSvar) {
            alertTexts.push(t("StatusCard.AlertTexts.forlengetSaksbehandlingsTid"));
        }

        return (
            <StatusCard
                id={id}
                tittel={sakTittel}
                sendtDato={sistOppdatert}
                behandlingsStatus="under_behandling"
                vedtakProgress={vedtakProgress}
                alertTexts={alertTexts}
            />
        );
    }
    if (sak.status === "FERDIGBEHANDLET") {
        const threeWeeksAgo = new Date();
        threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
        const behandlingsStatus = sistOppdatert > threeWeeksAgo ? "ferdigbehandlet_nylig" : "ferdigbehandlet_eldre";

        const alertTexts = [];
        if (sak.vilkar) {
            alertTexts.push(
                sak.forsteOppgaveFrist
                    ? t("StatusCard.AlertTexts.vilkarsfrist", { frist: new Date(sak.forsteOppgaveFrist) })
                    : t("StatusCard.AlertTexts.vilkar")
            );
        }

        return (
            <StatusCard
                id={id}
                tittel={sakTittel}
                sendtDato={sistOppdatert}
                behandlingsStatus={behandlingsStatus}
                alertTexts={alertTexts}
            />
        );
    }

    return null;
};

export default SoknadCard;
