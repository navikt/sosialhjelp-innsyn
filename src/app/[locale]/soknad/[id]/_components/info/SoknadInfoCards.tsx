"use client";

import SoknadInfoCard from "./SoknadInfoCard";
import { useGetSaksDetaljerSuspense } from "@generated/saks-oversikt-controller/saks-oversikt-controller";
import { useParams } from "next/navigation";
import {
    useGetDokumentasjonkravBetaSuspense,
    useGetOppgaverBetaSuspense,
    useGetVilkarSuspense,
} from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import * as R from "remeda";
import { JSX } from "react";
import { VStack } from "@navikt/ds-react";
import { DokumentasjonkravDto, VilkarResponse } from "@generated/model";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";

interface Props {
    navKontor?: string;
}

const SoknadInfoCards = ({ navKontor }: Props) => {
    const { id } = useParams<{ id: string }>();
    const { data: saksdetaljer } = useGetSaksDetaljerSuspense(id);
    const { data: oppgaver } = useGetOppgaverBetaSuspense(id);
    const { data: vilkar } = useGetVilkarSuspense(id);
    const { data: dokKrav } = useGetDokumentasjonkravBetaSuspense(id);

    const relevanteOppgaver = oppgaver.filter((oppgave) => !oppgave.erLastetOpp && oppgave.erFraInnsyn);
    const soknadsOppgaver = oppgaver.filter((oppgave) => !oppgave.erLastetOpp && !oppgave.erFraInnsyn);
    const harSakMedFlereVedtak = saksdetaljer.saker?.some((s) => s.antallVedtak > 1) ?? false;
    const harFattVedtakMedPositivtUtfall = saksdetaljer.saker
        .map((sak) =>
            R.pipe(
                sak.vedtak,
                R.sortBy((vedtak) => (vedtak.dato ? new Date(vedtak.dato) : new Date(0))),
                R.last()
            )
        )
        .some((vedtak) => vedtak?.utfall && ["INNVILGET", "DELVIS_INNVILGET"].includes(vedtak.utfall));
    const alleSakerHarIkkeInnsyn =
        saksdetaljer.saker.length > 0 && saksdetaljer.saker.every((sak) => sak.status === "IKKE_INNSYN");

    const behandlesIkke =
        saksdetaljer.status === "BEHANDLES_IKKE" ||
        (saksdetaljer.saker.length > 0 && saksdetaljer.saker.every((sak) => sak.status === "BEHANDLES_IKKE"));

    const cards: JSX.Element[] = [];

    if (saksdetaljer.status === "SENDT") {
        cards.push(<SoknadInfoCard key="sendt" state={{ type: "sendt" }} />);
    }

    if (behandlesIkke) {
        cards.push(<SoknadInfoCard key="behandlesIkke" state={{ type: "behandlesIkke" }} />);
        // Early exit her, så vi ikke viser noen andre kort.
        return cards;
    }

    if (alleSakerHarIkkeInnsyn) {
        cards.push(<SoknadInfoCard key="ikkeInnsyn" state={{ type: "ikkeInnsyn" }} />);
        // Early exit her, så vi ikke viser noen andre kort.
        return cards;
    }

    if (relevanteOppgaver.length > 0 && saksdetaljer.status !== "FERDIGBEHANDLET") {
        cards.push(
            <SoknadInfoCard
                key="oppgaver"
                state={{
                    type: "oppgaver",
                    oppgaver: relevanteOppgaver.map((oppgave) => ({
                        frist: oppgave.innsendelsesfrist ? new Date(oppgave.innsendelsesfrist) : undefined,
                        name: oppgave.dokumenttype,
                    })),
                    navKontor,
                }}
            />
        );
    }

    const relevantVilkar = vilkar.filter(
        (v): v is Omit<VilkarResponse, "tittel"> & Required<Pick<VilkarResponse, "tittel">> =>
            (v.status === "IKKE_OPPFYLT" || v.status === "RELEVANT") && !!v.tittel
    );
    const relevantDokKrav = dokKrav.filter(
        (d): d is Omit<DokumentasjonkravDto, "tittel"> & Required<Pick<DokumentasjonkravDto, "tittel">> =>
            (d.status === "IKKE_OPPFYLT" || d.status === "RELEVANT") && !d.erLastetOpp && !!d.tittel
    );
    if (relevantDokKrav.length + relevantVilkar.length > 0) {
        const combined: { name: string; frist?: Date }[] = [
            ...relevantVilkar.map((vilk) => ({ name: vilk.tittel })),
            ...relevantDokKrav.map((dk) => ({ name: dk.tittel, frist: dk.frist ? new Date(dk.frist) : undefined })),
        ];
        const sorted = R.sortBy(combined, (item) => (item.frist ? item.frist.getTime() : Number.POSITIVE_INFINITY));
        cards.push(
            <SoknadInfoCard
                key="vilkar"
                state={{
                    type: "vilkar",
                    vilkar: sorted,
                }}
            />
        );
    } else if (vilkar.length + dokKrav.length === 0 && harFattVedtakMedPositivtUtfall) {
        /* Ikke vis "Du kan ha vilkår" dersom det allerede er vilkår eller dokumentasjonskrav som er oppfylt.
         * Da vet vi at fagsystemet støtte vilkår/dokkrav, og kan derfor regne med at nye vilkår/dokkrav vil vises i innsyn.
         */
        cards.push(<SoknadInfoCard key="kan-ha-vilkar" state={{ type: "kanHaVilkar" }} />);
    }

    if (soknadsOppgaver.length > 0) {
        cards.push(
            <SoknadInfoCard
                key="soknadsOppgaver"
                state={{
                    type: "soknadsOppgaver",
                    oppgaver: soknadsOppgaver.map((oppgave) => ({
                        name: getVisningstekster(oppgave.dokumenttype, oppgave.tilleggsinformasjon).typeTekst,
                    })),
                }}
            />
        );
    }

    if (harSakMedFlereVedtak) {
        cards.push(<SoknadInfoCard key="nyttVedtak" state={{ type: "nyttVedtak" }} />);
    }
    if (saksdetaljer.status === "MOTTATT" || saksdetaljer.status === "UNDER_BEHANDLING") {
        if (saksdetaljer.forelopigSvar?.harMottattForelopigSvar) {
            cards.push(
                <SoknadInfoCard
                    key="forelopigSvar"
                    state={{ type: "forelopigSvar", forelopigSvarUrl: saksdetaljer.forelopigSvar.link }}
                />
            );
        } else if (cards.length === 0) {
            cards.push(<SoknadInfoCard key="saksbehandlingstid" state={{ type: "saksbehandlingstid" }} />);
        }
    }

    if (cards.length === 0) {
        return null;
    }
    if (cards.length === 1) {
        return cards[0];
    }
    return <VStack gap="space-8">{cards}</VStack>;
};

export default SoknadInfoCards;
